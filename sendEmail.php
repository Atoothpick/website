<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Grab the form inputs safely
    $name        = htmlspecialchars($_POST["name"]);
    $email       = htmlspecialchars($_POST["email"]);
    $phone       = htmlspecialchars($_POST["phone"]);
    $projectType = htmlspecialchars($_POST["project-type"]);
    $message     = htmlspecialchars($_POST["message"]);

    // Where do you want the email sent?
    $to      = "your-real-email@domain.com"; 
    $subject = "New Contact Form Submission";
    
    // Compose email body
    $body  = "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Phone: $phone\n";
    $body .= "Project Type: $projectType\n\n";
    $body .= "Message:\n$message\n";
    
    // Headers - best to use your domain in "From" if possible
    $headers = "From: no-reply@yourdomain.com\r\n";
    // But let them reply to the original person:
    $headers .= "Reply-To: $email\r\n";

    // Attempt to send
    if (mail($to, $subject, $body, $headers)) {
        echo "Your message has been sent successfully. We will get back to you soon!";
    } else {
        echo "Sorry, there was a problem sending your message.";
    }
} else {
    echo "Invalid request method.";
}
