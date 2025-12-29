import mysql from 'mysql2/promise';
import type { User, Event, EventPhoto, Guest } from '../types/index';

class Database {
  private connection: mysql.Connection | null = null;

  async connect(): Promise<void> {
    if (this.connection) return;

    const config = useRuntimeConfig();
    this.connection = await mysql.createConnection(config.databaseUrl);
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    if (!this.connection) {
      await this.connect();
    }
    
    try {
      const [rows] = await this.connection!.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // User operations
  async createUser(userData: { email: string; password: string; name: string; role?: string }): Promise<User> {
    const sql = `
      INSERT INTO users (email, password, name, role) 
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await this.query(sql, [
      userData.email,
      userData.password,
      userData.name,
      userData.role || 'client'
    ]);
    
    const user = await this.getUserById((result as any).insertId);
    return user as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = await this.query(sql, [email]);
    return (users as any[])[0] || null;
  }

  async getUserById(id: number): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const users = await this.query(sql, [id]);
    return (users as any[])[0] || null;
  }

  // Event operations
  async createEvent(eventData: {
    title: string;
    description: string;
    date: string;
    location: string;
    max_guests: number;
    organizer_id: number;
    qr_code: string;
  }): Promise<Event> {
    const sql = `
      INSERT INTO events (title, description, date, location, max_guests, organizer_id, qr_code)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await this.query(sql, [
      eventData.title,
      eventData.description,
      eventData.date,
      eventData.location,
      eventData.max_guests,
      eventData.organizer_id,
      eventData.qr_code
    ]);
    
    const event = await this.getEventById((result as any).insertId);
    return event as Event;
  }

  async getEventById(id: number): Promise<Event | null> {
    const sql = `
      SELECT e.*, u.name as organizer_name, u.email as organizer_email,
             COUNT(g.id) as guest_count
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      LEFT JOIN guests g ON e.id = g.event_id
      WHERE e.id = ?
      GROUP BY e.id
    `;
    const events = await this.query(sql, [id]);
    return (events as any[])[0] || null;
  }

  async getEvents(limit: number = 20, offset: number = 0): Promise<Event[]> {
    const sql = `
      SELECT e.*, u.name as organizer_name, u.email as organizer_email,
             COUNT(g.id) as guest_count
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      LEFT JOIN guests g ON e.id = g.event_id
      GROUP BY e.id
      ORDER BY e.date DESC
      LIMIT ? OFFSET ?
    `;
    const events = await this.query(sql, [limit, offset]);
    return (events as any[]) || [];
  }

  async getUserEvents(userId: number): Promise<Event[]> {
    const sql = `
      SELECT e.*, u.name as organizer_name, u.email as organizer_email,
             COUNT(g.id) as guest_count
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      LEFT JOIN guests g ON e.id = g.event_id
      WHERE e.organizer_id = ?
      GROUP BY e.id
      ORDER BY e.date DESC
    `;
    const events = await this.query(sql, [userId]);
    return (events as any[]) || [];
  }

  async deleteEvent(id: number, userId: number): Promise<boolean> {
    const sql = 'DELETE FROM events WHERE id = ? AND organizer_id = ?';
    const [result] = await this.query(sql, [id, userId]);
    return (result as any).affectedRows > 0;
  }

  // Event photos operations
  async addEventPhoto(photoData: { event_id: number; photo_url: string; uploaded_by: number }): Promise<EventPhoto> {
    const sql = `
      INSERT INTO event_photos (event_id, photo_url, uploaded_by)
      VALUES (?, ?, ?)
    `;
    const [result] = await this.query(sql, [
      photoData.event_id,
      photoData.photo_url,
      photoData.uploaded_by
    ]);
    
    const photo = await this.getEventPhotoById((result as any).insertId);
    return photo as EventPhoto;
  }

  async getEventPhotoById(id: number): Promise<EventPhoto | null> {
    const sql = `
      SELECT ep.*, u.name as uploaded_by_user
      FROM event_photos ep
      LEFT JOIN users u ON ep.uploaded_by = u.id
      WHERE ep.id = ?
    `;
    const photos = await this.query(sql, [id]);
    return (photos as any[])[0] || null;
  }

  async getEventPhotos(eventId: number): Promise<EventPhoto[]> {
    const sql = `
      SELECT ep.*, u.name as uploaded_by_user
      FROM event_photos ep
      LEFT JOIN users u ON ep.uploaded_by = u.id
      WHERE ep.event_id = ?
      ORDER BY ep.created_at DESC
    `;
    const photos = await this.query(sql, [eventId]);
    return (photos as any[]) || [];
  }

  // Guest operations
  async addGuest(guestData: { event_id: number; name: string; email: string }): Promise<Guest> {
    const sql = `
      INSERT INTO guests (event_id, name, email)
      VALUES (?, ?, ?)
    `;
    const [result] = await this.query(sql, [
      guestData.event_id,
      guestData.name,
      guestData.email
    ]);
    
    const guest = await this.getGuestById((result as any).insertId);
    return guest as Guest;
  }

  async getGuestById(id: number): Promise<Guest | null> {
    const sql = 'SELECT * FROM guests WHERE id = ?';
    const guests = await this.query(sql, [id]);
    return (guests as any[])[0] || null;
  }

  async getEventGuests(eventId: number): Promise<Guest[]> {
    const sql = 'SELECT * FROM guests WHERE event_id = ? ORDER BY created_at DESC';
    const guests = await this.query(sql, [eventId]);
    return (guests as any[]) || [];
  }

  async checkInGuestByQR(qrCode: string): Promise<Guest | null> {
    const sql = `
      UPDATE guests 
      SET qr_checked = 1, checked_in_at = NOW()
      WHERE qr_code = ? AND qr_checked = 0
    `;
    await this.query(sql, [qrCode]);
    
    // Return updated guest
    const sqlSelect = 'SELECT * FROM guests WHERE qr_code = ?';
    const guests = await this.query(sqlSelect, [qrCode]);
    return (guests as any[])[0] || null;
  }
}

export const db = new Database();
