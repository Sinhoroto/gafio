/*****************************************
| Data: 19/10/2020                                           |
| Resumo: Controlador de Microbiologia (CRUD)
| Sistema: GAFio                                             |
*****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";

class MicrobiologyController {
    // Método para cadastro
    async create(req: Request, res: Response) {
        const { IdPaciente, IdProntuario } = req.body;

        //verificação da existência do paciente e do prontuário
        const patientExists = await knex("Paciente").where(
            "SeqPaciente",
            "like",
            `%${IdPaciente}%`
        );

        const medicalRecordsExists = await knex("Prontuario").where(
            "SeqProntuario",
            "like",
            `%${IdProntuario}%`
        );

        if (!(patientExists[0] && medicalRecordsExists[0])) {
            return res.status(400).json({
                createdMicrobiology: false,
                message: "Paciente ou prontuário não corresponde.",
            });
        } else {
            try {
                await knex("Microbiologia").insert(req.body);
                return res
                    .status(201)
                    .json({ createdMicrobiology: true, ...req.body });
            } catch (error) {
                return res.status(400).json({
                    createdMicrobiology: false,
                    error,
                });
            }
        }
    }

    //Método para listagem
    async index(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const rows = 10;
            const query = knex("Microbiologia").select("*").limit(rows);

            if (id) {
                query.where({ IdMicrobiologia: id }).select("Microbiologia.*");
            }
            const results = await query;
            if (results.length) return res.json(results);
            else return res.json({ message: "Não encontrado." });
        } catch (error) {
            return res.json({ error });
        }
    }

    //método para atualização de dados
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { IdPaciente, IdProntuario } = req.body;

            if (IdPaciente) {
                const patientExists = await knex("Paciente").where(
                    "SeqPaciente",
                    "like",
                    `%${IdPaciente}%`
                );
                if (!patientExists[0]) {
                    return res.status(400).json({
                        createdMicrobiology: false,
                        message: "Paciente não existe!",
                    });
                }
            }

            if (IdProntuario) {
                const medicalRecordsExists = await knex("Prontuario").where(
                    "SeqProntuario",
                    "like",
                    `%${IdProntuario}%`
                );
                if (!medicalRecordsExists[0]) {
                    return res.status(400).json({
                        createdMicrobiology: false,
                        message: "Prontuário não existe!",
                    });
                }
            }

            await knex("Microbiologia")
                .update(req.body)
                .where({ IdMicrobiologia: id });

            return res.json({ updatedMicrobioloogy: true });
        } catch (error) {
            return res.status(400).json({ updatedMicrobioloogy: false, error });
        }
    }
}

export default new MicrobiologyController();
