import "server-only"
import Image from "next/image"
import { StarIcon } from "lucide-react"
import { getFieldReviews, type FieldReviewsData } from "@/queries/review.queries"

interface Props {
    fieldId: string
}

export default async function ReviewsSection({ fieldId }: Props) {
    const reviewsRes = await getFieldReviews(fieldId)
    const reviewsData: FieldReviewsData = reviewsRes?.data || { averageRating: 0, totalReviews: 0, reviews: [] }

    if (reviewsData.reviews.length === 0) {
        return (
            <div className="bg-surface-container/30 border border-white/5 rounded-2xl p-10 text-center text-on-surface-variant font-medium text-sm">
                No reviews have been posted for this venue yet. Be the first to play and review!
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsData.reviews.map((review) => (
                <article
                    key={review.id}
                    className="bg-surface-container border border-white/5 rounded-2xl p-6 flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-surface-container-high border border-white/5 flex items-center justify-center font-black uppercase text-sm text-primary-container">
                                    {review.user?.avatar ? (
                                        <Image
                                            src={review.user.avatar}
                                            alt={`${review.user.name} avatar`}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        review.user?.name?.slice(0, 2)
                                    )}
                                </div>
                                <div>
                                    <span className="block font-bold text-sm text-white">
                                        {review.user?.name || "Khelaghor Player"}
                                    </span>
                                    <span className="block text-[10px] text-on-surface-variant font-bold">
                                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full border border-white/5 text-xs font-black">
                                <StarIcon className="w-3.5 h-3.5 fill-tertiary-fixed text-tertiary-fixed" strokeWidth={0} />
                                <span>{review.rating}</span>
                            </div>
                        </div>

                        <p className="text-on-surface-variant text-sm leading-relaxed italic">
                            &ldquo;{review.comment}&rdquo;
                        </p>
                    </div>
                </article>
            ))}
        </div>
    )
}
