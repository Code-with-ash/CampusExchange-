import express from 'express';
import prisma from '../../db/db.js'
import authMiddleware from '../../middlewares/authmiddleware.js'
import { isValidUuid, listingCategories, listingConditions, parseFiniteNumber, validateString } from '../../utils/validation.js'
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const requestedPage = Number(req.query.page);
    const requestedLimit = Number(req.query.limit);
    if (
      (req.query.page !== undefined && (!Number.isInteger(requestedPage) || requestedPage < 1)) ||
      (req.query.limit !== undefined && (!Number.isInteger(requestedLimit) || requestedLimit < 1 || requestedLimit > 100))
    ) {
      return res.status(400).json({ success: false, message: 'Invalid pagination parameters' })
    }
    const page = requestedPage || 1;
    const limit = requestedLimit || 12;

    const totalProducts = await prisma.listing.count();
    const totalPages = Math.ceil(totalProducts / limit);
    const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);

    const listings = await prisma.listing.findMany({
        skip: (currentPage - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              department: true,
              year: true,
              mobilenumber: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    const formattedListings = listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: Number(listing.price),
      originalPrice: listing.originalprice ? Number(listing.originalprice) : null,
      category: listing.category,
      condition: listing.condition,
      imageUrl: listing.imageUrl || '',
      images: listing.imageUrl ? [listing.imageUrl] : [],
      branch: listing.user?.department ?? '',
      sellerYear: listing.user?.year ? `${listing.user.year}` : '',
      sellerName: listing.user?.name ?? 'Student Seller',
      whatsappNumber: listing.user?.mobilenumber ?? '',
      location: listing.pickuplocation,
      pickuplocation: listing.pickuplocation,
      postedTime: listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recently',
      createdAt: listing.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: formattedListings,
      products: formattedListings,
      currentPage,
      totalPages,
      totalProducts,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    });
  } catch (error) {
    console.error('Error fetching listings:', error?.message || 'Unknown error');
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
router.get('/my-listings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const listings = await prisma.listing.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            department: true,
            year: true,
            mobilenumber: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedListings = listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: Number(listing.price),
      originalPrice: listing.originalprice ? Number(listing.originalprice) : null,
      category: listing.category,
      condition: listing.condition,
      imageUrl: listing.imageUrl || '',
      images: listing.imageUrl ? [listing.imageUrl] : [],
      branch: listing.user?.department ?? '',
      sellerYear: listing.user?.year ? `${listing.user.year}` : '',
      sellerName: listing.user?.name ?? 'Student Seller',
      whatsappNumber: listing.user?.mobilenumber ?? '',
      location: listing.pickuplocation,
      pickuplocation: listing.pickuplocation,
      postedTime: listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recently',
      createdAt: listing.createdAt,
    }));

    return res.status(200).json({ success: true, data: formattedListings });
  } catch (error) {
    console.error('Error fetching my listings:', error?.message || 'Unknown error');
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!isValidUuid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid listing id' })
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            department: true,
            year: true,
            mobilenumber: true,
          },
        },
      },
    })

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' })
    }

    const formattedListing = {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: Number(listing.price),
      originalPrice: listing.originalprice ? Number(listing.originalprice) : null,
      category: listing.category,
      condition: listing.condition,
      imageUrl: listing.imageUrl || '',
      images: listing.imageUrl ? [listing.imageUrl] : [],
      branch: listing.user?.department ?? '',
      sellerYear: listing.user?.year ? `${listing.user.year}` : '',
      sellerName: listing.user?.name ?? 'Student Seller',
      whatsappNumber: listing.user?.mobilenumber ?? '',
      location: listing.pickuplocation,
      pickuplocation: listing.pickuplocation,
      postedTime: listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recently',
      createdAt: listing.createdAt,
    }

    return res.status(200).json({ success: true, data: formattedListing })
  } catch (error) {
    console.error('Error fetching listing:', error?.message || 'Unknown error')
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    if (!isValidUuid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid listing id' })
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this listing' });
    }

    await prisma.listing.delete({
      where: { id },
    });

    return res.status(200).json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error?.message || 'Unknown error');
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, description, price, originalPrice, condition, category, pickuplocation } = req.body;
    if (!isValidUuid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid listing id' })
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this listing' });
    }

    const titleError = title !== undefined ? validateString(title, 'Title', { min: 5, max: 120 }) : null
    const descriptionError = description !== undefined ? validateString(description, 'Description', { min: 20, max: 2000 }) : null
    const locationError = pickuplocation !== undefined ? validateString(pickuplocation, 'Pickup location', { min: 2, max: 200 }) : null
    const priceResult = price !== undefined ? parseFiniteNumber(price, 'Price', { min: 0.01, max: 100000000 }) : { value: undefined }
    const originalPriceResult = originalPrice !== undefined && originalPrice !== null && originalPrice !== ''
      ? parseFiniteNumber(originalPrice, 'Original price', { min: 0.01, max: 100000000 })
      : { value: originalPrice === null || originalPrice === '' ? null : undefined }
    if (
      titleError ||
      descriptionError ||
      locationError ||
      priceResult.error ||
      originalPriceResult.error ||
      (condition !== undefined && !listingConditions.has(condition)) ||
      (category !== undefined && !listingCategories.has(category)) ||
      (priceResult.value !== undefined && originalPriceResult.value !== undefined && originalPriceResult.value !== null && originalPriceResult.value < priceResult.value)
    ) {
      return res.status(400).json({ success: false, message: titleError || descriptionError || locationError || priceResult.error || originalPriceResult.error || 'Invalid listing details' })
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: priceResult.value }),
        ...(originalPrice !== undefined && { originalprice: originalPriceResult.value }),
        ...(condition && { condition }),
        ...(category && { category }),
        ...(pickuplocation !== undefined && { pickuplocation }),
      },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating listing:', error?.message || 'Unknown error');
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;