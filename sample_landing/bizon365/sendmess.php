<?php /*error_reporting(E_ALL);
ini_set('display_errors', 1);
*/
$webinar_date = date('d.m');
if (date('Y-m-d H:i:s') > date('Y-m-d H:i:s', strtotime('15:00')) && date('Y-m-d H:i:s') < date('Y-m-d H:i:s', strtotime('19:00'))) {
	$webinar_time = '19:00';
} else {
	$webinar_time = '15:00';
}
//
function clear_phone($phone, $second = false) {
    if ($second) {
        $phone_number = preg_replace('/[() +-]+/', '', $phone);
    } else {
        $phone_number = preg_replace('/[() -]+/', '', $phone);
    }
    return $phone_number;
}
//
function processRequest($first = false, $data = false, $url_path = false, $token = false, $file = false) {
    $api_url = 'https://online.sigmasms.ru/api/';
    // Get Token
    if ($first) {
        $usr = '****';
        $pwd = '****';
        $fields = array(
            'username' => $usr,
            'password' => $pwd,
            'type'     => 'local'
        );
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $api_url.'login');
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json; charset=UTF-8"));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode( $fields ));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $response = curl_exec($ch);
        curl_close($ch);
        if (!$response) {
            $response = json_encode(array('error' => 'true'));
        }
    } elseif($data && $url_path && $token && is_array($data)) {
        $fields = $data;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $api_url.$url_path);
        if ($file) {
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_HEADER, 1);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: multipart/form-data", "Authorization: ".$token));
            curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
            //curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
            //curl_setopt($ch, CURLOPT_UPLOAD, 1);
        } else {
            curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json;charset=UTF-8", "Accept: application/json", "Authorization: ".$token));
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode( $fields ));
            curl_setopt($ch, CURLOPT_HEADER, 0);
        }
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  
        //curl_setopt($ch, CURLOPT_POST, 1);
        $response = curl_exec($ch);  
        curl_close($ch);
        if (!$response) {
            $response = json_encode(array('error' => 'true'));
        }
    }
    header("Content-Type: application/json;charset=UTF-8");
    return $response;
}
//
function sendViber($phone, $secret = null, $username = null) {
	global $webinar_date;
    global $webinar_time;
    $result1 = processRequest(true);
    if ($result1) {
        $unjes = json_decode($result1);
        if (isset($unjes->token)) {
            if ($secret) {
                $full_url = 'https://welcome.socall.ru/click/'.$secret;
                /* bit.ly */
                $url_params = array(
                    'access_token' => $user_access_token,
                    'longUrl'      => $full_url,
                );
                $url_results = bitly_get('shorten', $url_params);
                if (isset($url_results['status_code']) && $url_results['status_code'] == 200) {
                    if (isset($url_results['data']['url'])) {
                        $short_url = $url_results['data']['url'];
                    }
                }
            }
        	$data = array(
                "type"       => 'vk',
                "recipient"  => clear_phone($phone),
                "payload"    => array(
                    "sender" => 'callcentre_socall',
                    "text"   => 'Вы успешно зарегистрированы на вебинар «Как получить удаленную работу с честным заработком от 400 рублей в час»! Мастер-класс начнется в '.$webinar_time.' по МСК, ссылка для входа > '.$full_url,
                ),
                "fallbacks"  => array(
                    /*array(
                        "type"       => 'viber',
                        "payload"    => array(
                            "sender" => 'X-City',
                            "text"   => 'Вы успешно зарегистрированы на вебинар «Как получить удаленную работу с честным заработком от 400 рублей в час»! Мастер-класс начнется в '.$webinar_time.' по МСК, ссылка для входа и бесплатные материалы у Вас на почте!',
                            "image"  => "673050ef-232b-49e1-a92c-c9713c6097a6",
                            "button" => array(
                                "text" => "Перейти на вебинар",
                                "url"  => $short_url,
                            ),
                        ),
                        '$options' => array(
                            "onStatus" => ["failed"],
                            "onTimeout" => array(
                                "timeout" => 120,
                                "except"  => ["delivered", "seen"]
                            )
                        )
                    ),*/
                    array(
                		"type"    => "sms",
                		"payload" => array(
                			"sender" => "SigmaSMS",
                			"text"   => 'Место на вебинар в '.$webinar_time.' забронировано! Ссылка > '.$short_url
                		),
                		'$options' => array(
                			"onStatus" => array("failed"),
                			"onTimeout" => array(
                				"timeout" => 120,
                				"except"  => array("delivered", "seen")
                			)
                		)
                	)
                )
            );
        	$result2 = processRequest(false, $data, 'sendings', $unjes->token);
            $unres2 = json_decode($result2);
            file_put_contents(date('Y-m-d')."request.log", '['.date('Y-m-d H:i:s').'] [4-OUTGOING-REQUEST] '.print_r($result2, true).PHP_EOL, FILE_APPEND);
            // send to WA
            if (isset($unres2->id) && !empty($unres2->id)) {
                /*$opts = array('http' =>
                    array(
                        'method'  => 'POST',
                        'header'  => array('Content-type: application/x-www-form-urlencoded'),
                        'content' => http_build_query(array(
                            'token'   => $unjes->token,
                            'sid'     => $unres2->id,
                            'phone'        => $phone, 
                            'username'     => $username,
                            'secret'       => $secret,
                            'webinar_date' => $webinar_date,
                            'webinar_time' => $webinar_time
                        ))
                    )
                );
                $context3 = stream_context_create($opts);
                $result3 = file_get_contents('https://get-x.ru/bizon365/sendwa.php', false, $context3);
                file_put_contents(date('Y-m-d')."request.log", '['.date('Y-m-d H:i:s').'] [5-OUTGOING-REQUEST] '.print_r($result3, true).PHP_EOL, FILE_APPEND);*/
            }
            //file_put_contents("bizon.log", date('Y-m-d H:i:s').' SEND: '.print_r($result2, true), FILE_APPEND);
            //if (!isset($_REQUEST['nowa'])) sendWA(['phone' => $phone, 'username' => $username], $short_url);
            //print_r($data);
            // add to address book
            /*$data3 = array(
                "phone"  => clear_phone($phone),
                "ListId" => "f357a72e-ca0d-43ca-b248-789195617d1a",
            );
            $result3 = processRequest(false, $data3, 'contacts', $unjes->token);
            file_put_contents("bizon.log", date('Y-m-d H:i:s').' ADD TO ADDRESS BOOK:', FILE_APPEND);
            file_put_contents("bizon.log", print_r($result3, true), FILE_APPEND);*/
        }
    }
}
//
function doActions() {
    global $webinar_time;
    //
    $request = file_get_contents('php://input');
    // log
    file_put_contents(date('Y-m-d')."request.log", '['.date('Y-m-d H:i:s').'] [3-INCOMING-REQUEST] '.print_r($request, true).PHP_EOL, FILE_APPEND);
    //
    $response = array();
    if ($request) {
        $INCOMING_LEAD_DATA = json_decode($request, true);
        if (!empty($INCOMING_LEAD_DATA['webinarTime'])) {
            $webinar_date = date('d.m', strtotime($INCOMING_LEAD_DATA['webinarTime']));
            $webinar_time = date('H:i', strtotime($INCOMING_LEAD_DATA['webinarTime']));
        }
        if (!empty($INCOMING_LEAD_DATA['phone'])) {
            sendViber($INCOMING_LEAD_DATA['phone'], $INCOMING_LEAD_DATA['secret'], $INCOMING_LEAD_DATA['username']);
        }
    }
}
//
header("Content-Type: text/html");
doActions();
die();