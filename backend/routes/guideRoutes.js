import express from 'express';
import District from '../models/District.js';
import Place from '../models/Place.js';
import Culture from '../models/Culture.js';
import { estimateTransportCostBDT } from '../utils/divisionDistance.js';

const router = express.Router();

// POST /api/guide/suggest
// body: { originDistrict: string, budget: number, tier?: 'low'|'mid' }
// Rule-based (no AI) recommender: given the traveller's current district and
// total budget (BDT), figures out which other districts are affordable and
// how many days they could stay there.
router.post('/suggest', async (req, res) => {
  try {
    const { originDistrict, budget, tier = 'low' } = req.body;
    const totalBudget = Number(budget);

    if (!originDistrict) return res.status(400).json({ message: 'Kon district theke jacchen seta bolun' });
    if (!totalBudget || totalBudget <= 0) return res.status(400).json({ message: 'Please provide a valid budget' });

    const origin = await District.findOne({ title: new RegExp(`^${originDistrict}$`, 'i') });
    if (!origin) return res.status(404).json({ message: 'Origin district not found' });

    // Include every district, including the traveller's own — a same-district
    // trip has ~0 transport cost, so it's often the most affordable option
    // and should still show up as a valid recommendation.
    const allDistricts = await District.find();

    const results = [];
    for (const d of allDistricts) {
      const isOwnDistrict = String(d._id) === String(origin._id);
      const transportCost = isOwnDistrict ? 0 : estimateTransportCostBDT(origin.division, d.division);
      const stayCost = tier === 'mid' ? (d.budget?.dailyStayMid ?? 2000) : (d.budget?.dailyStayLow ?? 800);
      // Staying in your own district usually means no hotel cost either —
      // just day-trip food + local transport.
      const dailyCost = isOwnDistrict
        ? (d.budget?.dailyFood ?? 500) + (d.budget?.dailyLocalTransport ?? 300)
        : stayCost + (d.budget?.dailyFood ?? 500) + (d.budget?.dailyLocalTransport ?? 300);

      const remaining = totalBudget - transportCost;
      if (remaining < dailyCost) continue; // can't even afford 1 day there

      const maxDays = Math.floor(remaining / dailyCost);
      const totalEstimatedCost = transportCost + maxDays * dailyCost;

      results.push({
        district: d.title,
        slug: d.slug,
        division: d.division,
        coverImage: d.coverImage,
        isOwnDistrict,
        maxDays,
        dailyCostEstimate: dailyCost,
        transportCostEstimate: transportCost,
        totalEstimatedCost,
        howToReach: d.howToReach,
        whereToStay: d.whereToStay,
        whatToEat: d.whatToEat,
        bestTimeToVisit: d.bestTimeToVisit,
      });
    }

    // Best value first: more days affordable, then cheaper transport
    results.sort((a, b) => b.maxDays - a.maxDays || a.transportCostEstimate - b.transportCostEstimate);
    const top = results.slice(0, 8);

    // Attach a few attraction suggestions + local food per recommended district
    for (const r of top) {
      const [places, foods] = await Promise.all([
        Place.find({ district: new RegExp(`^${r.district}$`, 'i') }).sort({ order: 1 }).limit(5),
        Culture.find({ category: /food/i }).limit(3),
      ]);
      r.topPlaces = places.map((p) => ({ title: p.title, slug: p.slug, coverImage: p.coverImage, category: p.category }));
      if (!r.whatToEat) r.whatToEat = foods.map((f) => f.title).join(', ');
    }

    res.json({
      originDistrict: origin.title,
      budget: totalBudget,
      tier,
      count: top.length,
      recommendations: top,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
