<?php
require_once 'api/db.php';

echo "<h2>JAYVEER Digital - Admin Setup Utility</h2>";

if (isset($_POST['email'])) {
    $email = trim($_POST['email']);
    try {
        $stmt = $pdo->prepare("UPDATE users SET role = 'admin' WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->rowCount() > 0) {
            echo "<p style='color:green;'>Success! The user with email <b>$email</b> is now an administrator.</p>";
            echo "<p>You can now log in with this account and access the <a href='index.html#dashboard'>Admin Console</a>.</p>";
        } else {
            echo "<p style='color:red;'>User not found. Please make sure the email is correct and the user has already registered.</p>";
        }
    } catch (PDOException $e) {
        echo "<p style='color:red;'>Error: " . $e->getMessage() . "</p>";
    }
}
?>

<form method="POST">
    <p>Enter the email of the user you want to promote to Admin:</p>
    <input type="email" name="email" required placeholder="admin@example.com" style="padding: 8px; width: 250px;">
    <button type="submit" style="padding: 8px 16px; cursor: pointer;">Promote to Admin</button>
</form>

<p><small>Note: Delete this file (<code>setup_admin.php</code>) after use for security.</small></p>
