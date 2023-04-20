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
use Symfony\Component\Security\Core\Security;

class DiscoveryController extends AbstractController
{
    #[Route('/discovery', name: 'discovery.index')]
    public function index(Request $request, EntityManagerInterface $entityManager, Security $security): Response
    {

        $isAlreadyInPlaylist = false;
        $trackAdded = false;
        if ($request->isMethod('POST')) {
            $track_id = $request->request->get('track_id');
            $idPlaylist = $request->request->get('playlist');
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
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find(1);
        $playlists = $entityManager->getRepository(Playlist::class)->findBy(['id_user' => $user]);

        return $this->render('discovery/discovery.html.twig', [
            'playlists' => $playlists,
            'isAlreadyInPlaylist' => $isAlreadyInPlaylist,
            'trackAdded' => $trackAdded,
        ]);
    }

    #[Route('/discovery', name: 'discovery')]
    public function discovery(Request $request): Response
    {
        $pseudo = $request->query->get('pseudo');
        var_dump($pseudo);
        return $this->render('discovery.html.twig', [
            'pseudo' => $pseudo,
        ]);
    }
}
