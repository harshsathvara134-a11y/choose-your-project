<?php
header('Content-Type: application/json');
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized. Must be logged in to store order locally.']);
    exit;
}

$product = $_POST['product'] ?? 'Premium Digital Good';
$amount = (float)($_POST['amount'] ?? 0.00);

try {
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, product, amount, status) VALUES (?, ?, ?, 'pending')");
    $stmt->execute([$_SESSION['user_id'], $product, $amount]);
    echo json_encode(['success' => true, 'message' => 'Secure Payment successful! You can track your order in the Dashboard.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Order recording failed: ' . $e->getMessage()]);
}
?>
