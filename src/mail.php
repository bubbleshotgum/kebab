<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    require '../vendor/autoload.php';
    $mail = new PHPMailer(TRUE);
    try {
    $_POST = json_decode(file_get_contents("php://input"), true);
    $mail->setFrom($_POST['email'], $_POST['name']);
    $mail->addAddress('danilamashoshin-bs@yandex.ru');
    $mail->Subject = 'Данные клиента:';
    $mail->isHTML();
    $mail->Body = 'Имя: '
    . $_POST['name']
    . '<br>Телефон: '
    . $_POST['phone']
    . '<br>Адрес электронной почты: '
    . $_POST['email']
    . '<br>Скидка: ' . $_POST['discount'];
    
    /* SMTP parameters. */
    
    /* Tells PHPMailer to use SMTP. */
    $mail->isSMTP();
    /* SMTP server address. */
    $mail->Host = 'smtp.gmail.com';
    /* Use SMTP authentication. */
    $mail->SMTPAuth = TRUE;
    
    /* Set the encryption system. */
    $mail->SMTPSecure = 'ssl';
    
    /* SMTP authentication username. */
    $mail->Username = 'demashoshin@gmail.com';
    
    /* SMTP authentication password. */
    $mail->Password = 'fsyxwixgaxejqzbc';
    
    /* Set the SMTP port. */
    $mail->Port = 465;
    
    /* Finally send the mail. */
    $mail->send();
    
    echo json_encode(['res' => 'All good']);
    }
    catch (Exception $e)
    {
        echo json_encode(['res' => $e->errorMessage()]);
    }
    catch (\Exception $e)
    {
        echo json_encode(['res' => $e->getMessage()]);
    }
?>