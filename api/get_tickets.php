<?php
header('Content-Type: application/json');
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please log in to view tickets.']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $stmt = $pdo->prepare("SELECT id, subject, message, status, created_at FROM tickets WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    $tickets = $stmt->fetchAll();

    echo json_encode(['success' => true, 'tickets' => $tickets]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
