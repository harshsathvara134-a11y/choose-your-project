 <?php
header('Content-Type: application/json');
require_once 'db.php';

$action = $_POST['action'] ?? '';

if ($action === 'register') {
    $name = $_POST['name'] ?? trim($_POST['email']);
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (!$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
        exit;
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    
    try {
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
        $stmt->execute([$name, $email, $hash]);
        
        // Log them in immediately after
        $_SESSION['user_id'] = $pdo->lastInsertId();
        $_SESSION['name'] = $name;
        $_SESSION['role'] = 'client';
        echo json_encode(['success' => true, 'message' => 'Account created successfully!', 'user' => $name, 'role' => 'client']);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo json_encode(['success' => false, 'message' => 'This email already exists in our secure database.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
    }

} elseif ($action === 'login') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['name'] = $user['name'];
        $_SESSION['role'] = $user['role'];
        echo json_encode(['success' => true, 'message' => 'Logged in securely!', 'user' => $user['name'], 'role' => $user['role']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or incorrectly hashed password.']);
    }

} elseif ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Logged out safely.']);

} elseif ($action === 'check') {
    if (isset($_SESSION['user_id'])) {
        echo json_encode(['success' => true, 'logged_in' => true, 'name' => $_SESSION['name'], 'role' => $_SESSION['role']]);
    } else {
        echo json_encode(['success' => true, 'logged_in' => false]);
    }
}
?>
