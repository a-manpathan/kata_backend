import { Request, Response } from 'express';
import { db } from '../db';
import { sweets } from '../db/schema';

import { eq, and, ilike, gte, lte } from 'drizzle-orm';

export const createSweet = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity } = req.body;
    
    const [newSweet] = await db.insert(sweets).values({
      name,
      category,
      price: price.toString(),
      quantity
    }).returning();

    res.status(201).json(newSweet);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create sweet' });
  }
};

export const getAllSweets = async (req: Request, res: Response) => {
  try {
    const allSweets = await db.select().from(sweets);
    res.status(200).json(allSweets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sweets' });
  }
};

export const updateSweet = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, category, price, quantity } = req.body;
  
      const [updated] = await db.update(sweets)
        .set({ 
          name, 
          category, 
          price: price ? price.toString() : undefined, 
          quantity 
        })
        .where(eq(sweets.id, id))
        .returning();
  
      if (!updated) {
        return res.status(404).json({ error: 'Sweet not found' });
      }
      
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Update failed' });
    }
  };
  
  export const deleteSweet = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const deleted = await db.delete(sweets)
        .where(eq(sweets.id, id))
        .returning();
      
      if (deleted.length === 0) {
        return res.status(404).json({ error: 'Sweet not found' });
      }
  
      res.status(200).json({ message: 'Sweet deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Delete failed' });
    }
  };
  export const searchSweets = async (req: Request, res: Response) => {
    try {
      const { name, category, minPrice, maxPrice } = req.query;
      
      const filters: any[] = [];
      
      if (name) filters.push(ilike(sweets.name, `%${name}%`));
      if (category) filters.push(ilike(sweets.category, `%${category}%`));
      if (minPrice) filters.push(gte(sweets.price, minPrice.toString()));
      if (maxPrice) filters.push(lte(sweets.price, maxPrice.toString()));
  
      const results = await db.select()
        .from(sweets)
        .where(and(...filters));
  
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ error: 'Search failed' });
    }
  };