import express from 'express';
import prisma from '../../db/db.js'
import authMiddleware from '../../middlewares/authmiddleware.js'
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const requestedPage = Number.parseInt(req.query.page, 10);
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 100)
      : 12;

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
    console.error('Error fetching listings:', error);
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
    console.error('Error fetching my listings:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

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
    console.error('Error deleting listing:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, description, price, originalPrice, condition, category, pickuplocation } = req.body;

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this listing' });
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(originalPrice !== undefined && { originalprice: originalPrice ? parseFloat(originalPrice) : null }),
        ...(condition && { condition }),
        ...(category && { category }),
        ...(pickuplocation !== undefined && { pickuplocation }),
      },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating listing:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;