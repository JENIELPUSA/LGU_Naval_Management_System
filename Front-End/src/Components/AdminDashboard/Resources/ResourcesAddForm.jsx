import React, { useContext, useState, useEffect } from 'react';
import { FileText, MessageSquareText, X, List } from 'lucide-react';
import { ResourcesDisplayContext } from '../../../contexts/ResourcesContext/ResourcesContext';

const AddResourceModal = ({ isOpen, onClose, editingData, isEditing }) => {
  const [formData, setFormData] = useState({
    resourceName: '',
    resourceType: '',
    description: '',
  });

  const { AddResources, UpdateResources } = useContext(ResourcesDisplayContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Set form data when modal opens or editingData changes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && editingData) {
        // Pre-fill form with editing data
        setFormData({
          resourceName: editingData.resource_name || '',
          resourceType: editingData.resource_type || '',
          description: editingData.description || '',
        });
      } else {
        // Clear form for adding new resource
        setFormData({
          resourceName: '',
          resourceType: '',
          description: '',
        });
      }
      setMessage('');
    }
  }, [isOpen, isEditing, editingData]);

  const handleCloseModal = () => {
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let result;
      if (isEditing && editingData) {
        // Update existing resource
        result = await UpdateResources(editingData._id, formData);
        setMessage('Resource updated successfully!');
      } else {
        // Add new resource
        result = await AddResources(formData);
        setMessage('Resource added successfully!');
      }
      
      // Wait a moment to show success message, then close
      setTimeout(() => {
        onClose();
        setFormData({
          resourceName: '',
          resourceType: '',
          description: '',
        });
      }, 1000);
    } catch (error) {
      // Error handling
      setMessage(`Failed to ${isEditing ? 'update' : 'add'} resource. Please try again.`);
      console.error(`Error ${isEditing ? 'updating' : 'adding'} resource:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 relative">
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Resource Management Form
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {isEditing ? 'Update a resource in your database.' : 'Add a new resource to your database.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Resource Name Input */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-purple-500" />
              Resource Name
            </label>
            <input
              type="text"
              name="resourceName"
              value={formData.resourceName}
              onChange={handleChange}
              placeholder="e.g., Projector A"
              className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors placeholder-gray-400 border border-gray-300"
              required
            />
          </div>

          {/* Resource Type Dropdown */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
              <List className="w-4 h-4 mr-2 text-purple-500" />
              Resource Type
            </label>
            <select
              name="resourceType"
              value={formData.resourceType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors border border-gray-300"
              required
            >
              <option value="">Select a type...</option>
              <option value="venue">Venue</option>
              <option value="equipment">Equipment</option>
              <option value="personnel">Personnel</option>
            </select>
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
              <MessageSquareText className="w-4 h-4 mr-2 text-purple-500" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Provide a detailed description of the resource."
              className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors placeholder-gray-400 border border-gray-300"
              required
            ></textarea>
          </div>

          {/* Submission Message */}
          {message && (
            <div className={`text-center mb-6 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isSubmitting 
              ? (isEditing ? 'Updating...' : 'Submitting...') 
              : (isEditing ? 'Update Resource' : 'Add Resource')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;