<?php
header('Content-Type: application/json');

$response = array('success' => false);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    $errname = $erremail = $errmessage = '';

    if (empty($name)) {
        $errname = "Name is required";
    }

    if (empty($email)) {
        $erremail = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erremail = "Email is not in proper format";
    }

    if (empty($message)) {
        $errmessage = "Message is required";
    }

    if (empty($errname) && empty($erremail) && empty($errmessage)) {
        $conn = mysqli_connect('localhost', 'root', '', 'contact');
        
        if (!$conn) {
            $response['error'] = "Connection failed: " . mysqli_connect_error();
        } else {
            $sql = "INSERT INTO data (name, email, message) VALUES (?, ?, ?)";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "sss", $name, $email, $message);

            if (mysqli_stmt_execute($stmt)) {
                // Send email
                $to = "your@email.com"; // Replace with your email address
                $subject = "New Contact Form Submission";
                $email_message = "Name: $name\nEmail: $email\nMessage: $message";
                $headers = "From: $email";

                if (mail($to, $subject, $email_message, $headers)) {
                    $response['success'] = true;
                } else {
                    $response['error'] = 'Failed to send email.';
                }
            } else {
                $response['error'] = "Error: " . mysqli_error($conn);
            }

            mysqli_stmt_close($stmt);
            mysqli_close($conn);
        }
    } else {
        $response['error'] = $errname . ' ' . $erremail . ' ' . $errmessage;
    }
}

echo json_encode($response);
?>