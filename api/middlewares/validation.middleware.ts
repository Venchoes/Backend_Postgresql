import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';

export const validateRegistration = [
    body('name')
        .notEmpty()
        .withMessage('Nome é obrigatório')
        .isLength({ min: 3 })
        .withMessage('Nome deve ter pelo menos 3 caracteres'),
    body('email')
        .notEmpty()
        .withMessage('E-mail é obrigatório')
        .isEmail()
        .withMessage('E-mail inválido'),
    body('password')
        .notEmpty()
        .withMessage('Senha é obrigatória')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter pelo menos 6 caracteres'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        next();
    }
];

export const validateLogin = [
    body('email')
        .notEmpty()
        .withMessage('E-mail é obrigatório')
        .isEmail()
        .withMessage('E-mail inválido'),
    body('password')
        .notEmpty()
        .withMessage('Senha é obrigatória'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];

const userValidationRules_old = () => {
    return [
        body('name')
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 3 })
            .withMessage('Name must be at least 3 characters long'),
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is not valid'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
    ];
};

// =====================
// Validadores de Task
// =====================

export const validateTaskCreate = [
    body('title').notEmpty().withMessage('Título é obrigatório').isLength({ min: 3 }).withMessage('Título deve ter ao menos 3 caracteres'),
    body('description').optional().isString().withMessage('Descrição deve ser texto').isLength({ max: 2000 }).withMessage('Descrição muito longa'),
    body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Status inválido'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Prioridade inválida'),
    body('dueDate').optional().isISO8601().withMessage('dueDate deve ser uma data ISO'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        next();
    }
];

export const validateTaskPut = [
    body('title').notEmpty().withMessage('Título é obrigatório').isLength({ min: 3 }).withMessage('Título deve ter ao menos 3 caracteres'),
    body('description').optional().isString().withMessage('Descrição deve ser texto').isLength({ max: 2000 }).withMessage('Descrição muito longa'),
    body('status').notEmpty().isIn(['todo', 'in-progress', 'done']).withMessage('Status inválido'),
    body('priority').notEmpty().isIn(['low', 'medium', 'high']).withMessage('Prioridade inválida'),
    body('dueDate').optional({ values: 'null' }).custom((value) => {
        if (value === null) return true;
        if (typeof value === 'string') {
            return !isNaN(Date.parse(value));
        }
        throw new Error('dueDate inválido');
    }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        next();
    }
];

export const validateTaskPatch = [
    body('title').optional().isLength({ min: 3 }).withMessage('Título deve ter ao menos 3 caracteres'),
    body('description').optional().isString().withMessage('Descrição deve ser texto').isLength({ max: 2000 }).withMessage('Descrição muito longa'),
    body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Status inválido'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Prioridade inválida'),
    body('dueDate').optional({ values: 'null' }).custom((value) => {
        if (value === null) return true;
        if (typeof value === 'string') {
            return !isNaN(Date.parse(value));
        }
        throw new Error('dueDate inválido');
    }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        next();
    }
];

export const validateQueryFilters = [
    query('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Status inválido'),
    query('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Prioridade inválida'),
    query('title').optional().isString().withMessage('title deve ser texto'),
    query('dueDateFrom').optional().isISO8601().withMessage('dueDateFrom inválido'),
    query('dueDateTo').optional().isISO8601().withMessage('dueDateTo inválido'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
