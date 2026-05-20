import { Response } from 'express';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';
import Lead from '../models/Lead';
import { AuthRequest } from '../types';

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort, page = '1' } = req.query;

    const filter: Record<string, unknown> = {};

    if (status && status !== 'all') filter.status = status;
    if (source && source !== 'all') filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const pageNum = parseInt(page as string, 10) || 1;
    const limit = 10;
    const skip = (pageNum - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit),
      Lead.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: leads,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limit),
      limit,
    });
  } catch (error) {
    console.error('getLeads error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch leads' });
  }
};

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
    if (!lead) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch lead' });
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('Creating lead with body:', req.body);
    console.log('User from token:', req.user);

    const { name, email, status, source } = req.body;

    if (!name || name.length < 2) {
      res.status(400).json({ success: false, error: 'Name must be at least 2 characters' });
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      res.status(400).json({ success: false, error: 'Valid email is required' });
      return;
    }
    if (!['New', 'Contacted', 'Qualified', 'Lost'].includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid status' });
      return;
    }
    if (!['Website', 'Instagram', 'Referral'].includes(source)) {
      res.status(400).json({ success: false, error: 'Invalid source' });
      return;
    }

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user?.id,
    });

    console.log('Lead created:', lead);
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    console.error('createLead error:', error);
    res.status(500).json({ success: false, error: 'Failed to create lead' });
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!lead) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update lead' });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete lead' });
  }
};

export const exportLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leads = await Lead.find({}).populate('createdBy', 'name');

    const exportDir = path.join('/tmp', 'exports');
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

    const filePath = path.join(exportDir, `leads_${Date.now()}.csv`);

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'status', title: 'Status' },
        { id: 'source', title: 'Source' },
        { id: 'createdAt', title: 'Created At' },
      ],
    });

    const records = leads.map((lead) => ({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      createdAt: new Date(lead.createdAt).toLocaleDateString(),
    }));

    await csvWriter.writeRecords(records);

    res.download(filePath, 'leads.csv', () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('exportLeads error:', error);
    res.status(500).json({ success: false, error: 'Failed to export leads' });
  }
};