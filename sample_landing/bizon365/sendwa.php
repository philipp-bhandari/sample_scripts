<?php //error_reporting(E_ALL);
//ini_set('display_errors', 1);
//ini_set('default_socket_timeout', 120);
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
function processRequest2($first = false, $data = false, $url_path = false, $file = false) {
    $token = '****';
    $api_url = '****';
    if ($first) {
        $fields = array(
            'phone'      => clear_phone($data['phone'], true),
            'nickname'   => $data['username'],
            'transport'  => 'whatsapp',
            'channel_id' => 17298
        );
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $api_url.'clients');
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json; charset=UTF-8", "Accept: application/json", "Authorization: ".$token));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $response = curl_exec($ch);
        curl_close($ch);
        if (!$response) {
            $response = json_encode(array('error' => 'true'));
        }
    } elseif ($data && $url_path && $token && is_array($data)) {
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
function sendWA($data) {
    $token = '****';
    $api_url = '****';
    //
    $result1 = processRequest2(true, $data);
    if ($result1) {
        $unjes = json_decode($result1);
        //print_r($unjes);
        if (isset($unjes->data->id)) {
        	$full_url = 'https://welcome.socall.ru/click/'.$data['secret'];
            $params = array(
                "client_id"    => $unjes->data->id,
                "text"         => 'Вы успешно зарегистрированы на вебинар «Как получить удаленную работу с честным заработком от 400 рублей в час»! Мастер-класс пройдет '.$data['webinar_date'].', начало в '.$data['webinar_time'].' по МСК. Ссылка для входа > '.$full_url,
                "type"         => "to_client",
                "transport"    => "whatsapp",
                "channel_id"   => 17298
            );
            $result2 = processRequest2(false, $params, 'messages');
            //print_r($result2);
            file_put_contents(date('Y-m-d')."request.log", '['.date('Y-m-d H:i:s').'] [8-SEND-WA-RESULT] '.print_r($result2, true).PHP_EOL, FILE_APPEND);
        }
    }
}
//
$token = isset($_POST['token']) ? $_POST['token'] : false;
$sid = isset($_POST['sid']) ? $_POST['sid'] : false;
$phone = isset($_POST['phone']) ? $_POST['phone'] : false;
$username = isset($_POST['username']) ? $_POST['username'] : false;
$secret = isset($_POST['secret']) ? $_POST['secret'] : false;
$webinar_date = isset($_POST['webinar_date']) ? $_POST['webinar_date'] : false;
$webinar_time = isset($_POST['webinar_time']) ? $_POST['webinar_time'] : false;
//
if ($token && $sid) {
	file_put_contents(date('Y-m-d')."request.log", '['.date('Y-m-d H:i:s').'] [6-OUTGOING-REQUEST] '.print_r($_POST, true).PHP_EOL, FILE_APPEND);
	//sleep(120);
	$ctx = stream_context_create(
		array(
			'http' => array(
				'header'  => array("Content-Type: application/json;charset=UTF-8", "Authorization: ".$token)
		    )
		)
	);
	$checkstatus = file_get_contents('https://online.sigmasms.ru/api/sendings/'.$sid, false, $ctx);
	file_put_contents(date('Y-m-d')."request.log", '['.date('Y-m-d H:i:s').'] [7-INCOMING-REQUEST] '.print_r($checkstatus, true).PHP_EOL, FILE_APPEND);
	$unres = json_decode($checkstatus);
	if (isset($unres->state->status)) {
		if ($unres->state->status != 'seen') {
			file_put_contents(date('Y-m-d')."request.log", '['.date('Y-m-d H:i:s').'] [8-SEND-WA]'.PHP_EOL, FILE_APPEND);
			if ($phone && $webinar_date && $webinar_time && $secret) {
				sendWA(array('phone' => $phone, 'username' => $username, 'secret' => $secret, 'webinar_date' => $webinar_date, 'webinar_time' => $webinar_time));
			}
		}
        if ($unres->state->status != 'failed' && $unres->state->status != 'pending') {
            file_put_contents(date('Y-m-d')."request.log", '['.date('Y-m-d H:i:s').'] [9-CAPTIS-SEND]'.PHP_EOL, FILE_APPEND);
            $ctx2 = stream_context_create(
                array(
                    'http' => array(
                        'method'  => 'POST',
                        'header'  => array("Content-Type: application/json;charset=UTF-8"),
                        'content' => '{"phone": "'.clear_phone($phone, true).'", "sync_id": "'.$secret.'"}'
                    )
                )
            );
            $sendstatus = file_get_contents('https://shred.socall.ru/loads/sync/phone/', false, $ctx2);
            file_put_contents(date('Y-m-d')."request.log", '['.date('Y-m-d H:i:s').'] [10-CAPTIS-RESULT] '.print_r($sendstatus, true).PHP_EOL, FILE_APPEND);
        }
	}
}