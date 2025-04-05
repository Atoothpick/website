<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Safely retrieve form data
    $name        = htmlspecialchars(trim($_POST["name"]));
    $email       = htmlspecialchars(trim($_POST["email"]));
    $phone       = htmlspecialchars(trim($_POST["phone"]));
    $projectType = htmlspecialchars(trim($_POST["project-type"]));
    $message     = htmlspecialchars(trim($_POST["message"]));

    // Your email address where you want to receive inquiries
    $to      = "sahjin.ribeiro@gmail.com";  
    $subject = "New Contact Form Submission";

    // Build the email body
    $body  = "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Phone: $phone\n";
    $body .= "Project Type: $projectType\n\n";
    $body .= "Message:\n$message\n";
    
    // Set headers: It's best if the From address is on your domain.
    $headers = "From: no-reply@yourdomain.com\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Try to send the email
    if (mail($to, $subject, $body, $headers)) {
        echo "Your message has been sent successfully. We will get back to you soon!";
    } else {
        echo "Sorry, there was an error sending your message. Please try again later.";
    }
} else {
    echo "Invalid request.";
}
?>
