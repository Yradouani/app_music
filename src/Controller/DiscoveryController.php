<?php

namespace App\Controller;

use App\Entity\Playlist;
use App\Entity\Track;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Security;

class DiscoveryController extends AbstractController
{
    #[Route('/discovery', name: 'discovery.index')]
    public function index(Request $request, EntityManagerInterface $entityManager, SessionInterface $session, Security $security): Response
    {


        $isAlreadyInPlaylist = false;
        $trackAdded = false;
        $optionSelected = false;
        if ($request->isMethod('POST')) {
            $track_id = $request->request->get('track_id');
            $idPlaylist = $request->request->get('playlist');
            if ($track_id) {
                $optionSelected = true;
                $playlistRepository = $entityManager->getRepository(Playlist::class);
                $playlist = $playlistRepository->find($idPlaylist);
                $tracks = $entityManager->getRepository(Track::class)->findBy(['num_track' => $track_id]);
                foreach ($tracks as $track) {
                    if ($track->getIdPlaylist() == $playlist) {
                        $isAlreadyInPlaylist = true;
                    }
                }
                if ($isAlreadyInPlaylist == false) {
                    $playlistRepository = $entityManager->getRepository(Playlist::class);
                    $playlist = $playlistRepository->find($idPlaylist);

                    $newTrack = new Track();
                    $newTrack->setIdPlaylist($playlist);
                    $newTrack->setNumTrack($track_id);
                    $entityManager->persist($newTrack);
                    $entityManager->flush();
                    $trackAdded = true;
                }
            }
        }
        $idUser = $session->get('idUser');
        if (isset($idUser)) {
            $userRepository = $entityManager->getRepository(User::class);
            $user = $userRepository->find($idUser);
            $playlists = $entityManager->getRepository(Playlist::class)->findBy(['id_user' => $user]);

            return $this->render('discovery/discovery.html.twig', [
                'playlists' => $playlists,
                'isAlreadyInPlaylist' => $isAlreadyInPlaylist,
                'trackAdded' => $trackAdded,
                'pseudo' => $user->getPseudo(),
                'optionSelected' => $optionSelected
            ]);
        } else {
            return $this->redirectToRoute('home.index');
        }
    }

    #[Route('/{url}', name: 'discovery')]
    public function discovery(Request $request): Response
    {
        return $this->render('discovery.html.twig');
    }
}
