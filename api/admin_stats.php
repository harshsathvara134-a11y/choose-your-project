<?php
header('Content-Type: application/json');
require_once 'db.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit;
}

try {
    $userCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $orderCount = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
    $totalRevenue = $pdo->query("SELECT SUM(amount) FROM orders WHERE status = 'completed'")->fetchColumn() ?: 0;
    $pendingOrders = $pdo->query("SELECT COUNT(*) FROM orders WHERE status = 'pending'")->fetchColumn();

    echo json_encode([
        'success' => true,
        'stats' => [
            'total_users' => $userCount,
            'total_orders' => $orderCount,
            'total_revenue' => $totalRevenue,
            'pending_orders' => $pendingOrders
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
