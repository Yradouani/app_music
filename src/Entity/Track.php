<?php

namespace App\Entity;

use App\Repository\TrackRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TrackRepository::class)]
class Track
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Playlist $id_playlist = null;

    #[ORM\Column]
    private ?int $num_track = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdPlaylist(): ?Playlist
    {
        return $this->id_playlist;
    }

    public function setIdPlaylist(?Playlist $id_playlist): self
    {
        $this->id_playlist = $id_playlist;

        return $this;
    }

    public function getNumTrack(): ?int
    {
        return $this->num_track;
    }

    public function setNumTrack(int $num_track): self
    {
        $this->num_track = $num_track;

        return $this;
    }
}
