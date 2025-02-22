<?php
header('Content-Type: application/json');

$response = array('success' => false);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    if (empty($name) || empty($email) || empty($message)) {
        $response['error'] = 'All fields are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['error'] = 'Invalid email format.';
    } else {
        // Database connection
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "contact";

        $conn = new mysqli($servername, $username, $password, $dbname);

        if ($conn->connect_error) {
            $response['error'] = 'Database connection failed.';
        } else {
            $stmt = $conn->prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $name, $email, $message);

            if ($stmt->execute()) {
                // Send email
                $to = "your@email.com";
                $subject = "New Contact Form Submission";
                $email_message = "Name: $name\nEmail: $email\nMessage: $message";
                $headers = "From: $email";

                if (mail($to, $subject, $email_message, $headers)) {
                    $response['success'] = true;
                } else {
                    $response['error'] = 'Failed to send email.';
                }
            } else {
                $response['error'] = 'Failed to save to database.';
            }

            $stmt->close();
            $conn->close();
        }
    }
}

echo json_encode($response);
?>