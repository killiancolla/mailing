"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import axios, { type AxiosResponse } from "axios"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, Clock, Eye, Globe, History, Mail, MapPin, PlusCircle, Send, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
// @ts-ignore
import sanitizeHtml from "sanitize-html";

const sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.filter((tag: string) => tag !== "a" && tag !== "img"), // Supprime <a> et <img>
    allowedAttributes: {}, // Supprime tous les attributs pour éviter les scripts malveillants
};

interface Lead {
    id: number
    campagne_id: number
    email: string
    prenom: string
    nom: string
    statut: number
    ville?: string
    website?: string
}

interface Campagne {
    id: number
    nom: string
}

interface EmailData {
    id: number
    lead_id: number
    campagne_id: number
    subject: string
    body: string
    status: string
    sent_at: string
    opened_at: string
    spam: number
    email?: string // Email of the lead
}

interface FormData {
    nom: string
    prenom: string
    email: string
    ville: string
    website: string
}

interface FormDataMail {
    step: number
    subject: string
    body: string
}

interface CampaignMail {
    id: number
    campagne_id: number
    step: number
    subject: string
    body: string
}

const formatDate = (timestamp: string) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date)
}

export default function Campagne() {
    const params = useParams()
    const campagneId = params.campagneId

    const [campagneData, setCampagneData] = useState<Campagne | null>(null)
    const [leads, setLeads] = useState<Lead[]>([])
    const [campaignMail, setCampaignMail] = useState<CampaignMail[]>([])
    const [mails, setMails] = useState<EmailData[]>([])
    const [selectedMail, setSelectedMail] = useState<EmailData | null>(null)
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
    const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false)
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset: resetLeadForm,
    } = useForm<FormData>()

    const {
        register: registerMail,
        handleSubmit: handleSubmitMail,
        formState: { errors: errorsMail },
        reset: resetMailForm,
    } = useForm<FormDataMail>()

    const onSubmit = async (data: FormData) => {
        const formData = { ...data, campagne_id: campagneId }

        try {
            const response: AxiosResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/leads`, formData)
            setLeads((previousLeads) => [...previousLeads, response.data])
            resetLeadForm()
            setIsLeadDialogOpen(false)
        } catch (error) {
            console.error("Erreur :", error)
        }
    }

    const onSubmitMail = async (data: FormDataMail) => {
        const formData = { ...data, campagne_id: campagneId }

        try {
            const response: AxiosResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/campagnes-mail`, formData)
            setCampaignMail((previousMails) => [...previousMails, response.data])
            resetMailForm()
            setIsEmailDialogOpen(false)
        } catch (error) {
            console.error("Erreur :", error)
        }
    }

    const openEmailDetail = (mail: EmailData) => {
        setSelectedMail(mail)
        setIsEmailModalOpen(true)
    }

    const emailHistory = mails.map((mail) => {
        const lead = leads.find((l) => l.id === mail.lead_id)
        return {
            ...mail,
            email: lead?.email || "Email inconnu",
        }
    })

    const sortedEmailHistory = [...emailHistory].sort((a, b) => {
        const dateA = a.status === "ouvert" && a.opened_at ? Number.parseInt(a.opened_at) : Number.parseInt(a.sent_at)
        const dateB = b.status === "ouvert" && b.opened_at ? Number.parseInt(b.opened_at) : Number.parseInt(b.sent_at)
        return dateB - dateA
    })

    useEffect(() => {
        async function fetchCampagneData() {
            try {
                const results = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/campagnes/${campagneId}`)
                setCampagneData(results.data)
                setLeads(results.data.Lead)
                setCampaignMail(results.data.CampagneMail)
                setMails(results.data.Mail)
            } catch (error) {
                console.error(error)
            }
        }
        fetchCampagneData()
    }, [campagneId])

    return (
        <main className="container mx-auto p-6 max-w-6xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{campagneData?.nom}</h1>
                </div>
                <Link href={"/"}>
                    <Button variant="outline">Retour aux campagnes</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <Users className="mr-2 h-5 w-5" />
                            Leads
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{leads.length}</div>
                        <p className="text-muted-foreground text-sm">Contacts dans cette campagne</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <Mail className="mr-2 h-5 w-5" />
                            Emails
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{mails.length}</div>
                        <p className="text-muted-foreground text-sm">Emails envoyés au total</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <BarChart3 className="mr-2 h-5 w-5" />
                            Taux d&apos;ouverture
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {mails.length > 0
                                ? Math.round((mails.filter((mail) => mail.status === "ouvert").length / mails.length) * 100)
                                : 0}
                            %
                        </div>
                        <p className="text-muted-foreground text-sm">
                            {mails.filter((mail) => mail.status === "ouvert").length} emails ouverts
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="leads" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="leads">Leads</TabsTrigger>
                    <TabsTrigger value="emails">Emails</TabsTrigger>
                    <TabsTrigger value="history">Historique</TabsTrigger>
                </TabsList>

                <TabsContent value="leads" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Mes leads</CardTitle>
                                <CardDescription>Gérez les contacts de votre campagne</CardDescription>
                            </div>
                            <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <PlusCircle className="h-4 w-4" />
                                        Nouveau lead
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[550px]">
                                    <DialogHeader>
                                        <DialogTitle>Nouveau lead</DialogTitle>
                                        <DialogDescription>
                                            Remplissez les données de votre lead. Cliquez sur Ajouter quand vous avez terminé.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="nom">Nom</Label>
                                                <Input id="nom" {...register("nom")} />
                                                {errors.nom && <p className="text-destructive text-sm">{errors.nom.message}</p>}
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="prenom">Prénom</Label>
                                                <Input id="prenom" {...register("prenom")} />
                                                {errors.prenom && <p className="text-destructive text-sm">{errors.prenom.message}</p>}
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                {...register("email", {
                                                    required: "L'email est obligatoire",
                                                    pattern: {
                                                        value: /^[^@]+@[^@]+\.[^@]+$/,
                                                        message: "Email invalide",
                                                    },
                                                })}
                                            />
                                            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="ville">Ville</Label>
                                            <Input id="ville" {...register("ville")} />
                                            {errors.ville && <p className="text-destructive text-sm">{errors.ville.message}</p>}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="website">Site web</Label>
                                            <Input
                                                id="website"
                                                type="url"
                                                placeholder="https://example.com"
                                                {...register("website", {
                                                    pattern: {
                                                        value:
                                                            /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
                                                        message: "URL invalide",
                                                    },
                                                })}
                                            />
                                            {errors.website && <p className="text-destructive text-sm">{errors.website.message}</p>}
                                        </div>

                                        <DialogFooter className="mt-4">
                                            <Button type="submit">Ajouter</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {leads.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Users className="h-12 w-12 text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground">Aucun lead dans cette campagne</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nom</TableHead>
                                                <TableHead>Prénom</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Ville</TableHead>
                                                <TableHead>Site web</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {leads.map((lead, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{lead.nom}</TableCell>
                                                    <TableCell>{lead.prenom}</TableCell>
                                                    <TableCell>{lead.email}</TableCell>
                                                    <TableCell>
                                                        {lead.ville ? (
                                                            <div className="flex items-center">
                                                                <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                                                {lead.ville}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {lead.website ? (
                                                            <a
                                                                href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center text-primary hover:underline"
                                                            >
                                                                <Globe className="h-3.5 w-3.5 mr-1" />
                                                                {lead.website.replace(/^https?:\/\/(www\.)?/, "")}
                                                            </a>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            Éditer
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="emails" className="mt-6">
                    <Card className="">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Emails de la campagne</CardTitle>
                                <CardDescription>Gérez les étapes de votre séquence d&apos;emails</CardDescription>
                            </div>
                            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <PlusCircle className="h-4 w-4" />
                                        Nouvelle étape
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Nouvelle étape d'email</DialogTitle>
                                        <DialogDescription>Créez une nouvelle étape pour votre séquence d'emails.</DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleSubmitMail(onSubmitMail)} className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="step">Étape</Label>
                                            <Input
                                                id="step"
                                                type="number"
                                                className="w-24"
                                                {...registerMail("step", { required: "L'étape est obligatoire" })}
                                            />
                                            {errorsMail.step && <p className="text-destructive text-sm">{errorsMail.step.message}</p>}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="subject">Objet</Label>
                                            <Input id="subject" {...registerMail("subject", { required: "L'objet est obligatoire" })} />
                                            {errorsMail.subject && <p className="text-destructive text-sm">{errorsMail.subject.message}</p>}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="body">Corps du message</Label>
                                            <Textarea
                                                id="body"
                                                rows={12}
                                                className="min-h-[200px]"
                                                {...registerMail("body", { required: "Le corps du mail est obligatoire" })}
                                            />
                                            {errorsMail.body && <p className="text-destructive text-sm">{errorsMail.body.message}</p>}
                                        </div>

                                        <DialogFooter className="mt-4">
                                            <Button type="submit">Ajouter</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {campaignMail.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Mail className="h-12 w-12 text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground">Aucun email dans cette campagne</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {campaignMail.map((mail, index) => (
                                        <Card key={index} className="overflow-hidden">
                                            <div className="bg-muted px-4 py-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                                                        {mail.step}
                                                    </div>
                                                    <span className="font-medium">{mail.subject}</span>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    Éditer
                                                </Button>
                                            </div>
                                            <CardContent className="p-4">
                                                <p className="text-sm whitespace-pre-line">{mail.body}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historique des emails</CardTitle>
                            <CardDescription>Suivi chronologique des emails envoyés et ouverts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sortedEmailHistory.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <History className="h-12 w-12 text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground">Aucun historique d&apos;email disponible</p>
                                </div>
                            ) : (
                                <ScrollArea className="h-[500px] pr-4">
                                    <div className="space-y-4">
                                        {sortedEmailHistory.map((mail, index) => {
                                            const isOpened = mail.status === "ouvert"
                                            const date = isOpened ? mail.opened_at : mail.sent_at

                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                                    onClick={() => openEmailDetail(mail)}
                                                >
                                                    <div
                                                        className={`rounded-full p-2 ${isOpened ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
                                                    >
                                                        {isOpened ? <Eye className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="font-medium">{mail.email}</div>
                                                            <Badge variant={isOpened ? "success" : "default"}>{isOpened ? "Ouvert" : "Envoyé"}</Badge>
                                                        </div>

                                                        <div className="text-sm text-muted-foreground flex items-center">
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            {formatDate(date)}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </ScrollArea>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Email Detail Modal */}
            <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{selectedMail?.subject}</DialogTitle>
                        <DialogDescription className="flex items-center justify-between">
                            <span>Envoyé à: {selectedMail?.email}</span>
                            <Badge variant={selectedMail?.status === "ouvert" ? "success" : "default"}>
                                {selectedMail?.status === "ouvert" ? "Ouvert" : "Envoyé"}
                            </Badge>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <Send className="h-3 w-3 mr-1" />
                                Envoyé le: {formatDate(selectedMail?.sent_at || "")}
                            </div>

                            {selectedMail?.status === "ouvert" && (
                                <div className="flex items-center">
                                    <Eye className="h-3 w-3 mr-1" />
                                    Ouvert le: {formatDate(selectedMail?.opened_at || "")}
                                </div>
                            )}
                        </div>

                        <Card>
                            <CardContent className="">
                                <ScrollArea className="max-h-[300px]">
                                    {/* <div className="whitespace-pre-line pr-4">{selectedMail?.body}</div> */}
                                    <div className="whitespace-pre-line pr-4" dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedMail?.body || "", sanitizeOptions) }} />
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setIsEmailModalOpen(false)}>Fermer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    )
}

