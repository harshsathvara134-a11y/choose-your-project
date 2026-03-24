<?php
$host = '127.0.0.1';
$db   = 'digital_agency';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // Try to connect to MySQL server first
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    // Create DB dynamically if it does not exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db`");
    $pdo->exec("USE `$db`");
    
    // Create highly secure tables with proper schemas
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('client', 'admin') DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        product VARCHAR(100),
        amount DECIMAL(10,2),
        status ENUM('pending', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('open', 'closed') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    // Migration logic for existing tables:
    try {
        $pdo->exec("ALTER TABLE users ADD COLUMN role ENUM('client', 'admin') DEFAULT 'client' AFTER password_hash");
    } catch (\PDOException $e) { /* Column might already exist */ }
    
    try {
        $pdo->exec("ALTER TABLE orders ADD COLUMN status ENUM('pending', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending' AFTER amount");
    } catch (\PDOException $e) { /* Column might already exist */ }
} catch (\PDOException $e) {
    header('Content-Type: application/json');
    die(json_encode(['success' => false, 'message' => 'Database connection failed. Ensure MySQL is actively running in XAMPP: ' . escapeshellarg($e->getMessage())]));
}

// Ensure session starts on all connected scripts
session_start();
?>
