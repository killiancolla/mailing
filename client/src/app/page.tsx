"use client";

import * as dotenv from 'dotenv';
dotenv.config();
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Campagne {
  id: number;
  nom: string;
  status: number;
}

export default function Home() {

  const [campagnes, setCampagnes] = useState<Campagne[]>([])
  const [newCampagne, setNewCampagne] = useState("")

  const handleAddCampagne = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/campagnes`,
        {
          nom: newCampagne
        })

      console.log(response.data);


      setCampagnes((previousCampagnes) => [...previousCampagnes, response.data]);

    } catch (error) {
      console.error(error)
    }
  }

  const handleToggleStatus = async (e: React.MouseEvent, campagneId: number, currentStatus: number) => {
    e.preventDefault()
    e.stopPropagation()

    // New status is the opposite of current status
    const newStatus = currentStatus === 0 ? 1 : 0

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/campagnes/${campagneId}`, {
        status: newStatus,
      })

      setCampagnes((previousCampagnes) =>
        previousCampagnes.map((campagne) =>
          campagne.id === campagneId ? { ...campagne, status: newStatus } : campagne,
        ),
      )

      console.log("Campaign status updated:", response.data)
    } catch (error) {
      console.error("Error updating campaign status:", error)
    }
  }

  useEffect(() => {
    async function fetchCampagnes() {
      try {
        const results = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/campagnes`)

        setCampagnes(results.data)
      } catch (error) {
        console.error(error);
      }
    }

    fetchCampagnes();
  }, [])

  return (
    <main className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Gestionnaire de Campagnes</h1>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mes campagnes</h2>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nouvelle campagne
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Nouvelle campagne</h4>
                  <p className="text-sm text-muted-foreground">Choisissez le nom de votre campagne.</p>
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="col-span-1">
                      Nom
                    </Label>
                    <Input
                      onChange={(e) => setNewCampagne(e.target.value)}
                      value={newCampagne}
                      id="name"
                      placeholder="Tatoueur Lyon..."
                      className="col-span-3"
                    />
                  </div>
                  <Button onClick={handleAddCampagne} className="w-full">
                    Ajouter
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {campagnes.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucune campagne disponible. Créez votre première campagne.
          </p>
        ) : (
          <ul className="space-y-2">
            {campagnes.map((campagne) => (
              <li key={campagne.id} className="transition-all hover:translate-x-1">
                <Link href={`/campagne/${campagne.id}`} className="block">
                  <div
                    className={`rounded-md px-4 py-3 flex justify-between items-center ${campagne.status === 0
                      ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                      : "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                      }`}
                  >
                    <span className="font-medium">{campagne.nom}</span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${campagne.status === 0
                          ? "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                      >
                        {campagne.status === 0 ? "Inactive" : "Active"}
                      </span>
                      <Switch
                        checked={campagne.status === 1}
                        onClick={(e) => handleToggleStatus(e, campagne.id, campagne.status)}
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                      />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
