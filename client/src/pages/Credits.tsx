/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Loading from "./Loading";
import { useAppContext } from "../context/AppContext";

import type { IPlan } from "../types/chat.types";

/**
 * Credits Page
 * -------------
 * Displays available subscription / credit plans
 * and handles Stripe checkout redirection.
 */
const Credits = () => {
    // Available credit plans
    const [plans, setPlans] = useState<IPlan[]>([]);

    // Loading state while fetching plans
    const [loading, setLoading] = useState<boolean>(true);

    // Token & axios from global context
    const { token, axios } = useAppContext();

    /**
     * Fetch all available credit plans
     */
    const fetchPlans = async (): Promise<void> => {
        try {
            const { data } = await axios.get("/api/credit/plan", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.success) {
                setPlans(data.plans as IPlan[]);
            } else {
                toast.error(data.message || "Failed to fetch plans");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to fetch plans");
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Initiates Stripe checkout for selected plan
     */
    const purchasePlan = async (planId: string): Promise<void> => {
        try {
            const { data } = await axios.post(
                "/api/credit/purchase",
                { planId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                // Redirect user to Stripe checkout
                window.location.href = data.url as string;
            } else {
                toast.error(data.message);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to purchase plan");
            }
        }
    };

    // Fetch plans once on page load
    useEffect(() => {
        fetchPlans();
    }, []);

    // Show loader while fetching plans
    if (loading) return <Loading />;

    return (
        <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-semibold text-center mb-10 xl:mt-30 text-gray-800 dark:text-white">
                Credit Plans
            </h2>

            {/* List all plans */}
            <div className="flex flex-wrap justify-center gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan._id}
                        className={`border border-gray-200 dark:border-purple-700 rounded-lg shadow hover:shadow-lg transition-shadow p-6 min-w-75 flex flex-col ${
                            plan._id === "pro"
                                ? "bg-purple-50 dark:bg-purple-900"
                                : "bg-white dark:bg-transparent"
                        }`}
                    >
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {plan.name}
                            </h3>

                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-300 mb-4">
                                ${plan.price}
                                <span className="text-base font-normal text-gray-600 dark:text-purple-200">
                                    {" "}
                                    / {plan.credits} credits
                                </span>
                            </p>

                            {/* Plan features */}
                            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-purple-200 space-y-1">
                                {plan.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Purchase button */}
                        <button
                            onClick={() => {
                                toast.loading("Redirecting to Stripe...");
                                purchasePlan(plan._id);
                            }}
                            className="mt-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium py-2 rounded transition-colors cursor-pointer"
                        >
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Credits;