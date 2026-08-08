// backend/src/services/organization.service.js

import * as organizationRepository from "../repositories/organization.repository.js";


/**
 * Create a new organization.
 */
export const createOrganization = async (
  organizationData
) => {
  const {
    name,
    email,
    phone,
    address,
  } = organizationData;

  if (!name || !name.trim()) {
    throw new Error(
      "Organization name is required."
    );
  }

  if (!email || !email.trim()) {
    throw new Error(
      "Organization email is required."
    );
  }

  // Check whether organization already exists.
  const existingOrganization =
    await organizationRepository.findOrganizationByEmail(
      email
    );

  if (existingOrganization) {
    throw new Error(
      "An organization with this email already exists."
    );
  }

  return organizationRepository.createOrganization({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone || null,
    address: address || null,
  });
};


/**
 * Get organization by ID.
 */
export const getOrganizationById = async (
  organizationId
) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required."
    );
  }

  const organization =
    await organizationRepository.findOrganizationById(
      organizationId
    );

  if (!organization) {
    throw new Error(
      "Organization not found."
    );
  }

  return organization;
};


/**
 * Get organization details with
 * employees and vehicles.
 */
export const getOrganizationDetails =
  async (organizationId) => {
    if (!organizationId) {
      throw new Error(
        "Organization ID is required."
      );
    }

    const organization =
      await organizationRepository.getOrganizationDetails(
        organizationId
      );

    if (!organization) {
      throw new Error(
        "Organization not found."
      );
    }

    return organization;
  };


/**
 * Update organization information.
 */
export const updateOrganization = async (
  organizationId,
  updateData
) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required."
    );
  }

  const organization =
    await organizationRepository.findOrganizationById(
      organizationId
    );

  if (!organization) {
    throw new Error(
      "Organization not found."
    );
  }

  const allowedFields = [
    "name",
    "email",
    "phone",
    "address",
    "logo",
  ];

  const filteredData = {};

  for (const field of allowedFields) {
    if (
      updateData[field] !== undefined
    ) {
      filteredData[field] =
        updateData[field];
    }
  }

  if (
    filteredData.name !== undefined &&
    !filteredData.name.trim()
  ) {
    throw new Error(
      "Organization name cannot be empty."
    );
  }

  if (filteredData.email) {
    filteredData.email =
      filteredData.email
        .trim()
        .toLowerCase();

    const existingOrganization =
      await organizationRepository.findOrganizationByEmail(
        filteredData.email
      );

    if (
      existingOrganization &&
      existingOrganization.id !== organizationId
    ) {
      throw new Error(
        "This organization email is already in use."
      );
    }
  }

  return organizationRepository.updateOrganization(
    organizationId,
    filteredData
  );
};


/**
 * Delete an organization.
 */
export const deleteOrganization = async (
  organizationId
) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required."
    );
  }

  const organization =
    await organizationRepository.findOrganizationById(
      organizationId
    );

  if (!organization) {
    throw new Error(
      "Organization not found."
    );
  }

  await organizationRepository.deleteOrganization(
    organizationId
  );

  return {
    success: true,
    message:
      "Organization deleted successfully.",
  };
};


/**
 * Get employees belonging to
 * an organization.
 */
export const getEmployees = async (
  organizationId,
  options = {}
) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required."
    );
  }

  return organizationRepository.getOrganizationEmployees(
    organizationId,
    options
  );
};


/**
 * Get organization statistics.
 */
export const getStatistics = async (
  organizationId
) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required."
    );
  }

  const organization =
    await organizationRepository.findOrganizationById(
      organizationId
    );

  if (!organization) {
    throw new Error(
      "Organization not found."
    );
  }

  return organizationRepository.getOrganizationStatistics(
    organizationId
  );
};


/**
 * Add an employee to an organization.
 */
export const addEmployee = async (
  organizationId,
  userId
) => {
  if (!organizationId || !userId) {
    throw new Error(
      "Organization ID and user ID are required."
    );
  }

  const organization =
    await organizationRepository.findOrganizationById(
      organizationId
    );

  if (!organization) {
    throw new Error(
      "Organization not found."
    );
  }

  const user =
    await organizationRepository.findUserById(
      userId
    );

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  if (
    user.organizationId === organizationId
  ) {
    throw new Error(
      "User already belongs to this organization."
    );
  }

  return organizationRepository.assignUserToOrganization(
    userId,
    organizationId
  );
};


/**
 * Remove an employee from an organization.
 */
export const removeEmployee = async (
  organizationId,
  userId
) => {
  if (!organizationId || !userId) {
    throw new Error(
      "Organization ID and user ID are required."
    );
  }

  const user =
    await organizationRepository.findUserById(
      userId
    );

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  if (
    user.organizationId !== organizationId
  ) {
    throw new Error(
      "User does not belong to this organization."
    );
  }

  return organizationRepository.removeUserFromOrganization(
    userId
  );
};


/**
 * Check whether a user belongs
 * to an organization.
 */
export const isOrganizationMember = async (
  organizationId,
  userId
) => {
  if (!organizationId || !userId) {
    return false;
  }

  return organizationRepository.isOrganizationMember(
    organizationId,
    userId
  );
};


/**
 * Get organization vehicles.
 */
export const getVehicles = async (
  organizationId,
  options = {}
) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required."
    );
  }

  return organizationRepository.getOrganizationVehicles(
    organizationId,
    options
  );
};


/**
 * Get organization rides.
 */
export const getRides = async (
  organizationId,
  options = {}
) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required."
    );
  }

  return organizationRepository.getOrganizationRides(
    organizationId,
    options
  );
};