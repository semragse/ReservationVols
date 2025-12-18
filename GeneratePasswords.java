import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePasswords {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String adminPassword = "admin123";
        String userPassword = "user123";
        
        String encodedAdmin = encoder.encode(adminPassword);
        String encodedUser = encoder.encode(userPassword);
        
        System.out.println("Admin password hash: " + encodedAdmin);
        System.out.println("User password hash: " + encodedUser);
        
        // SQL Statements
        System.out.println("\n--- SQL Statements ---");
        System.out.println("INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES");
        System.out.println("('Admin', 'System', 'admin@reservation.com', '" + encodedAdmin + "', 'ROLE_ADMIN'),");
        System.out.println("('User', 'Normal', 'user@reservation.com', '" + encodedUser + "', 'ROLE_USER');");
    }
}
