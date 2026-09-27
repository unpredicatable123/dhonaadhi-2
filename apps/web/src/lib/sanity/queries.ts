import { defineQuery } from 'groq';

/*
 * Every query is static GROQ (TypeGen reads this file). Filters are driven by params:
 * an empty array or null param disables its condition, so one query serves every
 * combination the product selector can produce.
 */

const IMAGE = `{ alt, decorative, hotspot, crop, "asset": asset->{ _id, url, metadata { lqip, dimensions { width, height, aspectRatio } } } }`;

const LINK = `{ _key, label, kind, href, section, "ref": reference->{ _type, "slug": slug.current, "category": category->slug.current, "subcategory": subcategory->slug.current, section } }`;

const PRODUCT_CARD = `{
	_id,
	modelNumber,
	name,
	"slug": slug.current,
	status,
	releaseDate,
	"category": category->slug.current,
	"subcategory": subcategory->slug.current,
	"image": heroImage ${IMAGE},
	cardSpecs[]{ label, value, unit },
	resolutionMp,
	lensMm,
	lensMmMax,
	irDistanceM,
	ipRating
}`;

const CATEGORY_CARD = `{
	_id,
	title,
	"slug": slug.current,
	icon,
	tagline,
	description,
	"image": heroImage ${IMAGE},
	"count": count(*[_type == "product" && category._ref == ^._id])
}`;

export const layoutQuery = defineQuery(`{
	"settings": *[_id == "siteSettings"][0]{
		companyName, brandName, siteUrl, email, phone, address,
		social[]{ platform, url },
		seo{ title, description, "image": image ${IMAGE} },
		motion
	},
	"navigation": *[_id == "navigation"][0]{
		items[]{ _key, "link": link ${LINK}, mega, columns[]{ _key, heading, links[] ${LINK} }, "featured": featured-> ${PRODUCT_CARD} },
		utility[] ${LINK},
		"cta": cta ${LINK}
	},
	"footer": *[_id == "footer"][0]{
		statement, newsletterText,
		columns[]{ _key, heading, links[] ${LINK} },
		legal[] ${LINK}
	},
	"categories": *[_type == "productCategory"] | order(orderRank) {
		_id, title, "slug": slug.current, icon, tagline,
		"count": count(*[_type == "product" && category._ref == ^._id]),
		"subcategories": *[_type == "productSubcategory" && category._ref == ^._id] | order(orderRank) {
			_id, title, "slug": slug.current,
			"count": count(*[_type == "product" && subcategory._ref == ^._id])
		}
	}
}`);

export const homeQuery = defineQuery(`*[_id == "homePage"][0]{
	seo,
	sections[]{
		_key,
		_type,
		anchor,
		_type == "heroAperture" => {
			headline, lead,
			"primaryCta": primaryCta ${LINK},
			"secondaryCta": secondaryCta ${LINK},
			"image": image ${IMAGE},
			"video": video.asset->url,
			detections[]{ _key, label, confidence, x, y, w, h },
			show3d
		},
		_type == "duskToNight" => {
			title, lead, conventionalLabel, enhancedLabel,
			"technology": technology->{ title, "slug": slug.current, proofPoint },
			"dayImage": dayImage ${IMAGE},
			"conventionalImage": conventionalImage ${IMAGE},
			"enhancedImage": enhancedImage ${IMAGE}
		},
		_type == "categoryRail" => {
			title, lead,
			"categories": select(
				count(categories) > 0 => categories[]-> ${CATEGORY_CARD},
				*[_type == "productCategory"] | order(orderRank) ${CATEGORY_CARD}
			)
		},
		_type == "explodedView" => {
			title, lead, framesBaseUrl, frameCount,
			"frames": frames[].asset->url,
			"poster": poster ${IMAGE},
			callouts[]{ _key, frame, title, body, x, y }
		},
		_type == "statsBand" => { title, lead, stats[]{ _key, value, suffix, label, trend } },
		_type == "industriesMosaic" => {
			title, lead,
			"industries": industries[]->{ _id, title, "slug": slug.current, summary, "image": image ${IMAGE} }
		},
		_type == "featuredProducts" => {
			title, lead,
			"products": select(
				count(products) > 0 => products[]-> ${PRODUCT_CARD},
				*[_type == "product" && status != "discontinued"] | order(releaseDate desc) [0...8] ${PRODUCT_CARD}
			)
		},
		_type == "ctaSearch" => { title, lead, placeholder, suggestions },
		_type == "logoCloud" => { title, items[]{ _key, name, detail, "logo": logo ${IMAGE} } },
		_type == "richTextSection" => { title, body }
	}
}`);

export const productsHubQuery = defineQuery(`{
	"categories": *[_type == "productCategory"] | order(orderRank) ${CATEGORY_CARD},
	"latest": *[_type == "product" && status == "new"] | order(releaseDate desc) [0...8] ${PRODUCT_CARD},
	"technologies": *[_type == "technology"] | order(title asc) { _id, title, "slug": slug.current, icon, summary, proofPoint },
	"filterConfig": *[_type == "productSubcategory"] | order(orderRank).filterConfig[]{ attribute, ui, label, collapsed }
}`);

export const categoryQuery =
	defineQuery(`*[_type == "productCategory" && slug.current == $category][0]{
	_id, title, "slug": slug.current, icon, tagline, description, seo,
	"image": heroImage ${IMAGE},
	"count": count(*[_type == "product" && category._ref == ^._id]),
	"subcategories": *[_type == "productSubcategory" && category._ref == ^._id] | order(orderRank) {
		_id, title, "slug": slug.current, description,
		"image": heroImage ${IMAGE},
		"count": count(*[_type == "product" && subcategory._ref == ^._id]),
		filterConfig[]{ _key, attribute, ui, label, collapsed }
	}
}`);

export const subcategoryQuery =
	defineQuery(`*[_type == "productSubcategory" && slug.current == $subcategory && category->slug.current == $category][0]{
	_id, title, "slug": slug.current, description, seo,
	"image": heroImage ${IMAGE},
	"category": category->{ title, "slug": slug.current },
	filterConfig[]{ _key, attribute, ui, label, collapsed },
	"siblings": *[_type == "productSubcategory" && category._ref == ^.category._ref && _id != ^._id] | order(orderRank) { title, "slug": slug.current }
}`);

/** Lightweight rows for computing facet options + counts across the whole listing scope. */
export const facetSourceQuery =
	defineQuery(`*[_type == "product" && ($category == null || category->slug.current == $category) && ($subcategory == null || subcategory->slug.current == $subcategory)]{
	"series": series->{ "value": slug.current, title },
	"formFactor": formFactor->{ "value": slug.current, title },
	resolutionMp, lensType, lightType, ipRating, ikRating, poe, audio, deterrence, power, channels,
	"aiFunctions": aiFunctions[]->{ "value": slug.current, title }
}`);

const LISTING_FILTER = `_type == "product"
	&& ($category == null || category->slug.current == $category)
	&& ($subcategory == null || subcategory->slug.current == $subcategory)
	&& (count($series) == 0 || series->slug.current in $series)
	&& (count($formFactor) == 0 || formFactor->slug.current in $formFactor)
	&& ($mpMin == null || resolutionMp >= $mpMin)
	&& ($mpMax == null || resolutionMp <= $mpMax)
	&& (count($lensType) == 0 || lensType in $lensType)
	&& (count($lightType) == 0 || lightType in $lightType)
	&& (count($aiFunctions) == 0 || count((aiFunctions[]->slug.current)[@ in $aiFunctions]) == count($aiFunctions))
	&& (count($ipRating) == 0 || ipRating in $ipRating)
	&& (count($ikRating) == 0 || ikRating in $ikRating)
	&& ($poe == null || poe == $poe)
	&& (count($audio) == 0 || count(audio[@ in $audio]) == count($audio))
	&& (count($deterrence) == 0 || count(deterrence[@ in $deterrence]) == count($deterrence))
	&& (count($power) == 0 || count(power[@ in $power]) > 0)
	&& ($chMin == null || channels >= $chMin)
	&& ($chMax == null || channels <= $chMax)
	&& ($q == null || modelNumber match $q || name match $q || shortDescription match $q)`;

export const listingNewestQuery = defineQuery(`{
	"total": count(*[${LISTING_FILTER}]),
	"items": *[${LISTING_FILTER}] | order(releaseDate desc, modelNumber asc) [$start...$end] ${PRODUCT_CARD}
}`);
export const listingResolutionQuery = defineQuery(`{
	"total": count(*[${LISTING_FILTER}]),
	"items": *[${LISTING_FILTER}] | order(coalesce(resolutionMp, 0) desc, modelNumber asc) [$start...$end] ${PRODUCT_CARD}
}`);
export const listingNameQuery = defineQuery(`{
	"total": count(*[${LISTING_FILTER}]),
	"items": *[${LISTING_FILTER}] | order(modelNumber asc) [$start...$end] ${PRODUCT_CARD}
}`);

export const productQuery =
	defineQuery(`*[_type == "product" && slug.current == $slug && category->slug.current == $category && subcategory->slug.current == $subcategory][0]{
	...${PRODUCT_CARD},
	shortDescription, highlights, sensor, lensType, opticalZoom, lightType, ikRating, poe, audio, deterrence, power,
	channels, storage, operatingTemp, seo, _updatedAt,
	dori{ detect, observe, recognize, identify },
	"categoryTitle": category->title,
	"subcategoryTitle": subcategory->title,
	"series": series->{ title, "slug": slug.current, tier, tagline },
	"formFactor": formFactor->{ title, "slug": slug.current },
	"gallery": gallery[] ${IMAGE},
	"spinFrames": spinFrames[].asset->url,
	"technologies": technologies[]->{ _id, title, "slug": slug.current, icon, summary, proofPoint },
	"aiFunctions": aiFunctions[]->{ _id, title, "slug": slug.current, icon, summary },
	variants[]{ _key, suffix, lensMm, status },
	fullSpecs[]{ _key, group, rows[]{ _key, key, value } },
	downloads[]{
		_key, title, kind, version, date, language,
		"url": coalesce(file.asset->url, externalUrl),
		"size": coalesce(file.asset->size, sizeBytes),
		"ext": coalesce(file.asset->extension, "link")
	},
	"bundle": bundleItems[]{ _key, quantity, "product": product-> ${PRODUCT_CARD} },
	"related": relatedProducts[]-> ${PRODUCT_CARD},
	"comparedWith": comparedWith[]-> ${PRODUCT_CARD}
}`);

export const compareQuery = defineQuery(`*[_type == "product" && slug.current in $slugs]{
	...${PRODUCT_CARD},
	sensor, lensType, opticalZoom, lightType, ikRating, poe, audio, deterrence, power, channels, storage, operatingTemp,
	dori{ detect, observe, recognize, identify },
	"series": series->title,
	"formFactor": formFactor->title,
	"technologies": technologies[]->title,
	"aiFunctions": aiFunctions[]->title,
	"datasheet": downloads[kind == "datasheet"][0]{ "url": coalesce(file.asset->url, externalUrl) }
}`);

export const searchQuery = defineQuery(
	`*[_type == "product" && (modelNumber match $q || name match $q)] | order(status == "discontinued" asc, releaseDate desc) [0...8] ${PRODUCT_CARD}`
);

export const brandQuery = defineQuery(`*[_id == "siteSettings"][0]{ companyName, brandName }`);

export const comingSoonQuery = defineQuery(`*[_type == "comingSoonPage" && section == $section][0]{
	section, title, lead, eta, links[] ${LINK}
}`);

export const sitemapQuery = defineQuery(`{
	"categories": *[_type == "productCategory"]{ "slug": slug.current, _updatedAt },
	"subcategories": *[_type == "productSubcategory"]{ "slug": slug.current, "category": category->slug.current, _updatedAt },
	"products": *[_type == "product"]{ "slug": slug.current, "category": category->slug.current, "subcategory": subcategory->slug.current, _updatedAt }
}`);

/** Resolves the public paths affected by a changed document (on-demand revalidation). */
export const pathsForDocumentQuery = defineQuery(`*[_id == $id][0]{
	_type,
	"slug": slug.current,
	"category": coalesce(category->slug.current, slug.current),
	"subcategory": subcategory->slug.current
}`);
