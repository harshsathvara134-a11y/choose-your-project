<?php
header('Content-Type: application/json');
require_once 'db.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit;
}

$order_id = $_POST['order_id'] ?? '';
$status = $_POST['status'] ?? '';

if (!$order_id || !$status) {
    echo json_encode(['success' => false, 'message' => 'Order ID and status are required.']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$status, $order_id]);

    echo json_encode(['success' => true, 'message' => 'Order status updated successfully!']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
