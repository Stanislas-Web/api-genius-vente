const {Company} = require('../models/company.model');

// Add a new company
exports.createCompany = async (req, res) => {
  try {
    const { name, address, category} = req.body;
    const company = new Company({ name, address, category});
    await company.save();
    res.status(201).json({ message: 'Company created successfully', company });
  } catch (error) {
    res.status(500).json({ message: 'Error creating company', error });
  }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('category');
    res.status(200).json({ companies });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error });
  }
};

// Get a company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('category');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json({ company });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company', error });
  }
};

// Update a company
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json({ message: 'Company updated successfully', company });
  } catch (error) {
    res.status(500).json({ message: 'Error updating company', error });
  }
};

// Delete a company
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting company', error });
  }
};
