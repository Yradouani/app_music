<?php
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Logout\LogoutUrlGenerator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
class LogoutController extends AbstractController
{
    #[Route('/logout', name: 'app_logout')]
    public function logout(LogoutUrlGenerator $logoutUrlGenerator): RedirectResponse
    {
        // Cette méthode n'a pas de code à exécuter car la déconnexion est gérée par Symfony

        // Utilisez le générateur d'URL de déconnexion pour obtenir l'URL de déconnexion
        $logoutUrl = $logoutUrlGenerator->getLogoutUrl();

        // Redirigez l'utilisateur vers la page de connexion
        return new RedirectResponse($logoutUrl);
    }
}
