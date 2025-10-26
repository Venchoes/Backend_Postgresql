"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQueryFilters = exports.validateTaskPatch = exports.validateTaskPut = exports.validateTaskCreate = exports.validateLogin = exports.validateRegistration = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegistration = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Nome é obrigatório')
        .isLength({ min: 3 })
        .withMessage('Nome deve ter pelo menos 3 caracteres'),
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('E-mail é obrigatório')
        .isEmail()
        .withMessage('E-mail inválido'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Senha é obrigatória')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter pelo menos 6 caracteres'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('E-mail é obrigatório')
        .isEmail()
        .withMessage('E-mail inválido'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Senha é obrigatória'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
const userValidationRules_old = () => {
    return [
        (0, express_validator_1.body)('name')
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 3 })
            .withMessage('Name must be at least 3 characters long'),
        (0, express_validator_1.body)('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is not valid'),
        (0, express_validator_1.body)('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
    ];
};
// =====================
// Validadores de Task
// =====================
exports.validateTaskCreate = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Título é obrigatório').isLength({ min: 3 }).withMessage('Título deve ter ao menos 3 caracteres'),
    (0, express_validator_1.body)('description').optional().isString().withMessage('Descrição deve ser texto').isLength({ max: 2000 }).withMessage('Descrição muito longa'),
    (0, express_validator_1.body)('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Status inválido'),
    (0, express_validator_1.body)('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Prioridade inválida'),
    (0, express_validator_1.body)('dueDate').optional().isISO8601().withMessage('dueDate deve ser uma data ISO'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
exports.validateTaskPut = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Título é obrigatório').isLength({ min: 3 }).withMessage('Título deve ter ao menos 3 caracteres'),
    (0, express_validator_1.body)('description').optional().isString().withMessage('Descrição deve ser texto').isLength({ max: 2000 }).withMessage('Descrição muito longa'),
    (0, express_validator_1.body)('status').notEmpty().isIn(['todo', 'in-progress', 'done']).withMessage('Status inválido'),
    (0, express_validator_1.body)('priority').notEmpty().isIn(['low', 'medium', 'high']).withMessage('Prioridade inválida'),
    (0, express_validator_1.body)('dueDate').optional({ values: 'null' }).custom((value) => {
        if (value === null)
            return true;
        if (typeof value === 'string') {
            return !isNaN(Date.parse(value));
        }
        throw new Error('dueDate inválido');
    }),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
exports.validateTaskPatch = [
    (0, express_validator_1.body)('title').optional().isLength({ min: 3 }).withMessage('Título deve ter ao menos 3 caracteres'),
    (0, express_validator_1.body)('description').optional().isString().withMessage('Descrição deve ser texto').isLength({ max: 2000 }).withMessage('Descrição muito longa'),
    (0, express_validator_1.body)('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Status inválido'),
    (0, express_validator_1.body)('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Prioridade inválida'),
    (0, express_validator_1.body)('dueDate').optional({ values: 'null' }).custom((value) => {
        if (value === null)
            return true;
        if (typeof value === 'string') {
            return !isNaN(Date.parse(value));
        }
        throw new Error('dueDate inválido');
    }),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
exports.validateQueryFilters = [
    (0, express_validator_1.query)('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Status inválido'),
    (0, express_validator_1.query)('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Prioridade inválida'),
    (0, express_validator_1.query)('title').optional().isString().withMessage('title deve ser texto'),
    (0, express_validator_1.query)('dueDateFrom').optional().isISO8601().withMessage('dueDateFrom inválido'),
    (0, express_validator_1.query)('dueDateTo').optional().isISO8601().withMessage('dueDateTo inválido'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
