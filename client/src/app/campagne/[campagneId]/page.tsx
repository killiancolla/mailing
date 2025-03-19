"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart3, Mail, PlusCircle, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

interface Lead {
    id: number;
    campagne_id: number;
    email: string;
    prenom: string;
    nom: string;
    statut: number;
}

interface Campagne {
    id: number;
    nom: string;
}

interface Mail {
    id: number;
    lead_id: number;
    campagne_id: number;
    subject: string;
    body: string;
    status: string;
    sent_at: string;
    opened_at: string;
    spam: number;
}

interface FormData {
    nom: string;
    prenom: string;
    email: string;
}

interface FormDataMail {
    step: number;
    subject: string;
    body: string;
}

interface CampaignMail {
    id: number;
    campagne_id: number;
    step: number;
    subject: string;
    body: string;
}

export default function Campagne() {

    const params = useParams();
    const campagneId = params.campagneId;

    const [campagneData, setCampagneData] = useState<Campagne | null>(null);
    const [leads, setLeads] = useState<Lead[]>([])
    const [campaignMail, setCampaignMail] = useState<CampaignMail[]>([])
    const [mails, setMails] = useState<Mail[]>([])

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const { register: registerMail, handleSubmit: handleSubmitMail, formState: { errors: errorsMail } } = useForm<FormDataMail>();

    const onSubmit = async (data: { nom: string; prenom: string; email: string }) => {

        data = { ...data, ...{ campagne_id: campagneId } };

        try {
            const response: AxiosResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/leads`, data);

            setLeads((previousLeads) => [...previousLeads, response.data]);
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    const onSubmitMail = async (data: { step: number; subject: string; body: string }) => {

        data = { ...data, ...{ campagne_id: campagneId } };

        console.log(data);


        try {
            const response: AxiosResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/campagnes-mail`, data);

            setCampaignMail((previousMails) => [...previousMails, response.data]);
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    useEffect(() => {
        async function fetchCampagneData() {
            try {
                const results = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/campagnes/${campagneId}`)
                setCampagneData(results.data)
                setLeads(results.data.Lead)
                setCampaignMail(results.data.CampagneMail)
                setMails(results.data.Mail)
            } catch (error) {
                console.error(error);
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
                <Link href={'/'}>
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
                            {Math.round((mails.filter((mail) => mail.status === "ouvert").length / mails.length) * 100)}%
                        </div>
                        <p className="text-muted-foreground text-sm">
                            {mails.filter((mail) => mail.status === "ouvert").length} emails ouverts
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="leads" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="leads">Leads</TabsTrigger>
                    <TabsTrigger value="emails">Emails</TabsTrigger>
                </TabsList>

                <TabsContent value="leads" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Mes leads</CardTitle>
                                <CardDescription>Gérez les contacts de votre campagne</CardDescription>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <PlusCircle className="h-4 w-4" />
                                        Nouveau lead
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-96">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Nouveau lead</h4>
                                            <p className="text-sm text-muted-foreground">Remplissez les données de votre lead</p>
                                        </div>
                                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
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

                                            <Button type="submit" className="w-full">
                                                Ajouter
                                            </Button>
                                        </form>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </CardHeader>
                        <CardContent>
                            {leads.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Users className="h-12 w-12 text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground">Aucun lead dans cette campagne</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Prénom</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leads.map((lead, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{lead.nom}</TableCell>
                                                <TableCell>{lead.prenom}</TableCell>
                                                <TableCell>{lead.email}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        Éditer
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="emails" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Emails de la campagne</CardTitle>
                                <CardDescription>Gérez les étapes de votre séquence d&apos;emails</CardDescription>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <PlusCircle className="h-4 w-4" />
                                        Nouvelle étape
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-96">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Nouvelle étape</h4>
                                            <p className="text-sm text-muted-foreground">Remplissez les données de votre étape</p>
                                        </div>
                                        <form onSubmit={handleSubmitMail(onSubmitMail)} className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="step">Étape</Label>
                                                <Input
                                                    id="step"
                                                    type="number"
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
                                                    rows={5}
                                                    {...registerMail("body", { required: "Le corps du mail est obligatoire" })}
                                                />
                                                {errorsMail.body && <p className="text-destructive text-sm">{errorsMail.body.message}</p>}
                                            </div>

                                            <Button type="submit" className="w-full">
                                                Ajouter
                                            </Button>
                                        </form>
                                    </div>
                                </PopoverContent>
                            </Popover>
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
            </Tabs>
        </main>
    )

    // return (
    //     <div>
    //         <p>Nom de la campagne : {campagneData?.nom}</p>
    //         <div>
    //             <h2>Mes leads</h2>
    //             <ul>
    //                 {leads.map((lead, index) => (
    //                     <li key={index}>{lead.nom} - {lead.prenom} - {lead.email}</li>
    //                 ))}
    //             </ul>
    //             <Popover>
    //                 <PopoverTrigger asChild>
    //                     <Button variant="outline" className="flex items-center gap-2">
    //                         <PlusCircle className="h-4 w-4" />
    //                         Nouveau lead
    //                     </Button>
    //                 </PopoverTrigger>
    //                 <PopoverContent className="w-80">
    //                     <div className="grid gap-4">
    //                         <div className="space-y-2">
    //                             <h4 className="font-medium leading-none">Nouveau lead</h4>
    //                             <p className="text-sm text-muted-foreground">Remplissez les données de votre lead</p>
    //                         </div>
    //                         <div className="grid gap-4">
    //                             <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
    //                                 <div className="grid grid-cols-4 items-center gap-4">
    //                                     <Label className="col-span-1">Nom</Label>
    //                                     <Input {...register("nom", { required: "Le nom est obligatoire" })} className="col-span-3" />
    //                                     {errors.nom && <p className="text-red-500 text-sm">{errors.nom.message}</p>}
    //                                 </div>

    //                                 <div className="grid grid-cols-4 items-center gap-4">
    //                                     <Label className="col-span-1">Prénom</Label>
    //                                     <Input {...register("prenom", { required: "Le prénom est obligatoire" })} className="col-span-3" />
    //                                     {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom.message}</p>}
    //                                 </div>

    //                                 <div className="grid grid-cols-4 items-center gap-4">
    //                                     <Label className="col-span-1">Email</Label>
    //                                     <Input {...register("email", { required: "L'email est obligatoire", pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "Email invalide" } })} className="col-span-3" />
    //                                     {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
    //                                 </div>

    //                                 <Button type="submit" className="w-full">Envoyer</Button>
    //                             </form>
    //                         </div>
    //                     </div>
    //                 </PopoverContent>
    //             </Popover>
    //         </div>
    //         <div>
    //             <h2>Mails de la campagnes</h2>
    //             {campaignMail.map((mail, index) => (
    //                 <div key={index}>
    //                     <p>{mail.step}</p>
    //                     <p>{mail.subject}</p>
    //                     <p>{mail.body}</p>
    //                 </div>
    //             ))}
    //             <Popover>
    //                 <PopoverTrigger asChild>
    //                     <Button variant="outline" className="flex items-center gap-2">
    //                         <PlusCircle className="h-4 w-4" />
    //                         Nouvelle étape
    //                     </Button>
    //                 </PopoverTrigger>
    //                 <PopoverContent className="w-80">
    //                     <div className="grid gap-4">
    //                         <div className="space-y-2">
    //                             <h4 className="font-medium leading-none">Nouvelle étape</h4>
    //                             <p className="text-sm text-muted-foreground">Remplissez les données de votre étape</p>
    //                         </div>
    //                         <div className="grid gap-4">
    //                             <form onSubmit={handleSubmitMail(onSubmitMail)} className="grid gap-4">
    //                                 <div className="grid grid-cols-4 items-center gap-4">
    //                                     <Label className="col-span-1">Step</Label>
    //                                     <Input type="number" {...registerMail("step", { required: "L'étape est obligatoire" })} className="col-span-3" />
    //                                     {errorsMail.step && <p className="text-red-500 text-sm">{errorsMail.step.message}</p>}
    //                                 </div>

    //                                 <div className="grid grid-cols-4 items-center gap-4">
    //                                     <Label className="col-span-1">Objet</Label>
    //                                     <Input {...registerMail("subject", { required: "L'object est obligatoire" })} className="col-span-3" />
    //                                     {errorsMail.subject && <p className="text-red-500 text-sm">{errorsMail.subject.message}</p>}
    //                                 </div>

    //                                 <div className="grid grid-cols-4 items-center gap-4">
    //                                     <Label className="col-span-1">Corps</Label>
    //                                     <Input type='text' {...registerMail("body", { required: "Le corps du mail est obligatoire" })} className="col-span-3" />
    //                                     {errorsMail.body && <p className="text-red-500 text-sm">{errorsMail.body.message}</p>}
    //                                 </div>

    //                                 <Button type="submit" className="w-full">Envoyer</Button>
    //                             </form>
    //                         </div>
    //                     </div>
    //                 </PopoverContent>
    //             </Popover>
    //         </div>
    //         <div>
    //             Données de la campagne
    //             <p>Nombre de leads : {leads.length}</p>
    //             <p>Nombre de mails envoyés : {mails.length}</p>
    //             <p>Nombre de mails ouverts : {mails.filter((mail) => mail.status == 'ouvert').length}</p>
    //         </div>

    //     </div>
    // )
}
