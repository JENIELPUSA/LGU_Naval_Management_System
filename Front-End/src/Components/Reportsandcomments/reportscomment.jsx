import React, { useState, useContext } from "react";
import { Calendar, MessageCircle, Star, Award, Send } from "lucide-react";
import { ReportDisplayContext } from "../../contexts/ReportContext/ReportContext";
import { useParams } from "react-router-dom";

const ReportComments = () => {
    const { AddReport } = useContext(ReportDisplayContext);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [showRatingMessage, setShowRatingMessage] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const { id } = useParams();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating === 0) {
            setShowRatingMessage(true);
            return;
        }

        setShowRatingMessage(false);
        const name = "defaultUser";

        const newComment = {
            id: Date.now(),
            event_id: id,
            name: name,
            comment: comment,
            rating: rating,
            timestamp: new Date(),
        };
        AddReport(newComment);
        setRating(0);
        setComment("");
    };

    const renderStars = () => {
        const displayRating = hoverRating || rating;
        return (
            <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={32}
                        className={`transform cursor-pointer transition-all duration-200 hover:scale-110 ${
                            i < displayRating
                                ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                                : "text-gray-300 hover:text-yellow-300"
                        }`}
                        onClick={() => setRating(i + 1)}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                    />
                ))}
            </div>
        );
    };

    const getRatingText = () => {
        const displayRating = hoverRating || rating;
        const ratingTexts = [
            "Piliin ang rating",
            "Napakahirap",
            "Hindi maganda",
            "Okay lang",
            "Maganda",
            "Napakaganda!",
        ];
        return ratingTexts[displayRating];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                        <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                        Pahayag sa Kaganapan
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        Ibahagi ang inyong karanasan at magbigay ng feedback tungkol sa mga LGU events
                    </p>
                </div>

                {/* Form */}
                <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-xl backdrop-blur-sm">
                    <div className="p-8 sm:p-12">
                        <div className="mb-6 flex items-center">
                            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Magbigay ng Feedback</h2>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                    Rating sa Kaganapan
                                </label>
                                <div className="flex flex-col items-center rounded-xl bg-gray-50/50 p-6">
                                    {renderStars()}
                                    <p className="mt-3 text-lg font-medium text-gray-600">
                                        {getRatingText()}
                                    </p>
                                </div>
                                {showRatingMessage && (
                                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                                        <p className="flex items-center text-sm font-medium text-red-600">
                                            <Award className="mr-2 h-4 w-4" />
                                            Pakipili ang inyong rating para sa event.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                    Inyong Komento
                                </label>
                                <textarea
                                    rows="5"
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full resize-none rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-4 text-lg shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ibahagi ang inyong karanasan, mga nakitang maganda, at mga mungkahing pagbabago..."
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                            >
                                <Send className="h-5 w-5" />
                                <span>Isumite ang Komento</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportComments;
