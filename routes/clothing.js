import express from 'express';
const router = express.Router();
import { getAllClothing, addClothingItem, deleteClothingItem } from '../controllers/clothingController.js';
import db from '../db/connector.js';

// Налаштування персонального дизайну
const renderOptions = { layout: 'clothes/layout' };

// 1. СПИСОК ТОВАРІВ
router.get('/list', async (req, res) => {
    try {
        const items = await getAllClothing();
        res.render('clothes/clothing_page', { 
            ...renderOptions, 
            items,
            title: 'Apparel Core | Склад' 
        });
    } catch (err) {
        console.error("Помилка при отриманні списку:", err);
        res.status(500).send("Помилка бази даних");
    }
});

// 2. ФОРМА СТВОРЕННЯ
router.get('/create', (req, res) => {
    res.render('forms/clothing_form', { 
        ...renderOptions, 
        title: 'Додати новий одяг',
        isEdit: false 
    });
});

// 3. ЗБЕРЕЖЕННЯ НОВОГО (POST)
router.post('/create', async (req, res) => {
    try {
        await addClothingItem(req.body);
        res.redirect('/clothing/list');
    } catch (err) {
        console.error("Помилка при створенні:", err);
        res.status(500).send("Не вдалося зберегти товар");
    }
});

// 4. ФОРМА РЕДАГУВАННЯ (GET)
router.get('/edit/:id', async (req, res) => {
    try {
        const itemId = parseInt(req.params.id);
        const result = await db.query('SELECT * FROM clothing WHERE id = $1', [itemId]);
        
        if (result.rows.length === 0) {
            return res.status(404).send("Помилка: Товар не знайдено.");
        }

        res.render('forms/clothing_form', { 
            ...renderOptions, 
            item: result.rows[0], 
            isEdit: true, 
            title: 'Редагування товару' 
        });
    } catch (err) {
        console.error("Помилка при отриманні даних:", err);
        res.status(500).send("Внутрішня помилка сервера");
    }
});

// 5. ОНОВЛЕННЯ ДАНИХ (POST)
router.post('/edit/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const { type, brand, size, price, stock_quantity } = req.body;

        const query = `
            UPDATE clothing 
            SET type = $1, brand = $2, size = $3, price = $4, stock_quantity = $5 
            WHERE id = $6`;
        
        await db.query(query, [type, brand, size, price, stock_quantity, itemId]);
        res.redirect('/clothing/list');
    } catch (err) {
        console.error("Помилка при оновленні:", err);
        res.status(500).send("Не вдалося оновити дані");
    }
});

// 6. ВИДАЛЕННЯ (POST)
router.post('/delete/:id', async (req, res) => {
    try {
        await deleteClothingItem(req.params.id);
        res.redirect('/clothing/list');
    } catch (err) {
        console.error("Помилка при видаленні:", err);
        res.status(500).send("Помилка при видаленні");
    }
});

// ЦЕЙ РЯДОК КРИТИЧНО ВАЖЛИВИЙ:
export default router;