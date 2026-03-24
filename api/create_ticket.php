<?php
header('Content-Type: application/json');
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please log in to create a ticket.']);
    exit;
}

$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if (!$subject || !$message) {
    echo json_encode(['success' => false, 'message' => 'Subject and message are required.']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO tickets (user_id, subject, message, status) VALUES (?, ?, ?, 'open')");
    $stmt->execute([$_SESSION['user_id'], $subject, $message]);
    echo json_encode(['success' => true, 'message' => 'Support ticket created successfully! Our team will get back to you soon.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
