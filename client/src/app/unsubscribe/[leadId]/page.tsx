"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from "next/link"
import { useParams } from "next/navigation"

enum UnsubscribeStatus {
    LOADING,
    SUCCESS,
    ERROR,
    INITIAL
}

export default function UnsubscribePage() {

    const params = useParams();
    const leadId = params.leadId

    const [status, setStatus] = useState<UnsubscribeStatus>(UnsubscribeStatus.INITIAL)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const handleUnsubscribe = useCallback(() => {
        const unsubscribe = async () => {
            setStatus(UnsubscribeStatus.LOADING)

            try {
                await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/leads/${leadId}`, {
                    statut: 0
                })

                setStatus(UnsubscribeStatus.SUCCESS)
            } catch (error) {
                console.error("Failed to unsubscribe:", error)
                setStatus(UnsubscribeStatus.ERROR)

                if (axios.isAxiosError(error) && error.response) {
                    setErrorMessage(`Erreur ${error.response.status}: ${error.response.data.message || "Une erreur est survenue"}`)
                } else {
                    setErrorMessage("Une erreur inattendue est survenue. Veuillez réessayer plus tard.")
                }
            }
        }
        unsubscribe()
    }, [leadId])

    useEffect(() => {
        handleUnsubscribe();
    }, [handleUnsubscribe])

    return (
        <main className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Désinscription</CardTitle>
                    <CardDescription>
                        Gestion de votre abonnement aux communications
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col items-center justify-center py-6">
                    {status === UnsubscribeStatus.LOADING && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="h-12 w-12 text-primary animate-spin" />
                            <p className="text-center text-muted-foreground">
                                Traitement de votre demande de désinscription...
                            </p>
                        </div>
                    )}

                    {status === UnsubscribeStatus.SUCCESS && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-medium">Désinscription confirmée</h3>
                                <p className="text-muted-foreground">
                                    Vous avez été désinscrit avec succès de notre liste de diffusion.
                                    Vous ne recevrez plus de communications de notre part.
                                </p>
                            </div>
                        </div>
                    )}

                    {status === UnsubscribeStatus.ERROR && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <XCircle className="h-16 w-16 text-destructive" />
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-medium">Échec de la désinscription</h3>
                                <p className="text-muted-foreground">
                                    {errorMessage}
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={handleUnsubscribe}
                                    className="mt-4"
                                >
                                    Réessayer
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-center border-t pt-6">
                    <Link href="https://killian-colla.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Retour à la page d&apos;accueil
                    </Link>
                </CardFooter>
            </Card>
        </main>
    )
}