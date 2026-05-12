const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const uploadsDir = path.join(__dirname, '..', 'uploads');

async function listImages(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT i.id, i.image, i.created_at, i.user_id, u.username
       FROM images i
       JOIN users u ON u.id = i.user_id
       ORDER BY i.created_at DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not load gallery' });
  }
}

async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    const filename = req.file.filename;
    const [result] = await pool.query(
      'INSERT INTO images (user_id, image) VALUES (?, ?)',
      [req.user.id, filename]
    );
    return res.status(201).json({
      id: result.insertId,
      image: filename,
      user_id: req.user.id,
      created_at: new Date(),
    });
  } catch (err) {
    console.error(err);
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (_) {}
    }
    return res.status(500).json({ message: 'Upload failed' });
  }
}

async function updateImage(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'Invalid image id' });
    }
    const [rows] = await pool.query(
      'SELECT id, image, user_id FROM images WHERE id = ?',
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Drawing not found' });
    }
    if (rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own drawings' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No new image file provided' });
    }
    const oldFile = rows[0].image;
    const newName = req.file.filename;
    await pool.query('UPDATE images SET image = ? WHERE id = ?', [newName, id]);
    const oldPath = path.join(uploadsDir, oldFile);
    if (oldFile && oldFile !== newName && fs.existsSync(oldPath)) {
      try {
        fs.unlinkSync(oldPath);
      } catch (_) {}
    }
    return res.json({ id, image: newName });
  } catch (err) {
    console.error(err);
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (_) {}
    }
    return res.status(500).json({ message: 'Update failed' });
  }
}

async function deleteImage(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: 'Invalid image id' });
    }
    const [rows] = await pool.query(
      'SELECT image, user_id FROM images WHERE id = ?',
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Drawing not found' });
    }
    if (rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only remove your own drawings' });
    }
    await pool.query('DELETE FROM images WHERE id = ?', [id]);
    const filePath = path.join(uploadsDir, rows[0].image);
    if (rows[0].image && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (_) {}
    }
    return res.json({ message: 'Removed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Delete failed' });
  }
}

module.exports = { listImages, uploadImage, updateImage, deleteImage };
