<?php
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
require __DIR__ . '/vendor/autoload.php';
use Mailgun\Mailgun;
$mg = Mailgun::create('****');
//
function bizonAuth() {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,"https://online.bizon365.ru/api/v1/auth/login");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, "username=****@gmail.com&password=****");
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_COOKIEFILE, dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
	curl_setopt($ch, CURLOPT_COOKIEJAR, dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	$result = curl_exec($ch);
	file_put_contents(date('Y-m-d')."request.log", '['.date('Y-m-d H:i:s').'] [0-BIZON-OUTGOING-REQUEST] '.print_r($result, true).PHP_EOL, FILE_APPEND);
}
//
function sendMess($data, $hash) {
	$ch2 = curl_init();
	curl_setopt($ch2, CURLOPT_URL, '/bizon365/sendmess.php');
	curl_setopt($ch2, CURLOPT_POST, 1);
	curl_setopt($ch2, CURLOPT_POSTFIELDS, '{"phone":"'.$data['phone'].'","webinarTime":"'.$data['time'].'","secret":"'.$hash.'","username":"'.trim($data['username']).'"}');
	curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch2, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
	$result3 = curl_exec($ch2);
}
//
function registerWebinar($data, $mail_object=NULL) {
	$pageId = '7394:4life';
	$roomId = '7394:4life';
	
	$only_time = isset($data['only_time']) ? $data['only_time'] : false;
	$date_time = isset($data['time']) ? $data['time'] : "2018-10-22T12:00:00.000Z";
	$params = array(
		'pageId'       => $pageId,
		'time'         => $date_time,
		'email'        => trim($data['email']),
		'phone'        => $data['phone'],
		'username'     => trim($data['username']),
		'utm_source'   => $data['utm_source'],
		'utm_medium'   => $data['utm_medium'],
		'utm_campaign' => $data['utm_campaign'],
		'utm_term'     => $data['utm_term'],
		'utm_content'  => $data['utm_content'],
		'utm_banner'   => $data['utm_banner']
	);

// ОТПРАВКА ПОЧТЫ ЧЕРЕЗ МЭЙЛГАН
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
	if($mail_object != NULL) {
		$email_adress = $params['email'];
		$email_adress = strip_tags($email_adress);
		$email_adress = htmlspecialchars($email_adress);
		if(file_get_contents('template.html')){
			$template_file = file_get_contents('template.html');
		}
		else {
			$template_file = 'Произошла ошибка в формировании письма.';
		}


		$mail_object->messages()->send('socall.ru', [
			'from'    => 'info@lifepack.ru',
			'to'      => $email_adress,
			'subject' => 'Тестовое письмо',
			'html'    => $template_file
		]);

		$mysqli = new mysqli("localhost", "root", "****", "****");
		$email_adress = $mysqli->real_escape_string($email_adress);
		$query = "INSERT INTO emails (id, email) VALUES (NULL,'$email_adress')";
		$result = mysqli_query($mysqli, $query);

		if(!$result) {
			$mail_object->messages()->send('socall.ru', [
				'from'    => 'info@lifepack.ru',
				'to'      => 'f.kulikov@socall.ru',
				'subject' => 'Не удалось сохранить email в базу',
				'text'    => 'Код ошибки mysql: ' . mysqli_errno($mysqli) . ', email: ' . $email_adress
			]);

		}
	}	
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'https://online.bizon365.ru/api/v1/webinars/subpages/addSubscriber');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_COOKIEFILE, dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
	curl_setopt($ch, CURLOPT_COOKIEJAR, dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	$result = curl_exec($ch);
	file_put_contents(date('Y-m-d')."request.log", '['.date('Y-m-d H:i:s').'] [2-BIZON-OUTGOING-REQUEST] '.print_r($result, true).PHP_EOL, FILE_APPEND);
	$result2 = json_decode($result, true);
	if (isset($result2['hash'])) {
		echo 'ok';
		sendMess($data, $result2['hash']);
	} else {
		echo 'err';
	}
}

function doActions($mail_object=NULL) {
	$output = $_POST;
	if ($output) {
		if (isset($output['email']) && filter_var($output['email'], FILTER_VALIDATE_EMAIL)) {
			file_put_contents(date('Y-m-d')."request.log", '['.date('Y-m-d H:i:s').'] [1-INCOMING-REQUEST] '.print_r(json_encode($output), true).PHP_EOL, FILE_APPEND);
			registerWebinar($output, $mail_object);
		} else {
			echo 'err_email';
		}
	}
}

$filename = 'cookie.txt';
header("Content-Type: text/html");
if (file_exists($filename) && (date('Y-m-d H:i:s', filemtime($filename)) > date('Y-m-d H:i:s', strtotime('-59 minutes')))) {
    doActions($mg);
} else {
	if (file_exists($filename)) {
		unlink($filename);
	}
	bizonAuth();
	doActions();
}
die();
