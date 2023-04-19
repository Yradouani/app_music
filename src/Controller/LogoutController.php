<?php

// LogoutController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class LogoutController extends AbstractController
{
    #[Route('/logout', name: 'logout')]
    public function logout(): RedirectResponse
    {
        
        // Vérifier si la session est active
        if (session_status() === PHP_SESSION_ACTIVE) {
            // Détruire la session
            session_destroy();
        }

        // Rediriger vers la page d'accueil
        return $this->redirectToRoute('home.index');
    }

    
}
