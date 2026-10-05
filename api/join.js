export default async function handler(request, response) {

    if (request.method !== "POST") {
        return response.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {

        const { name, className, email } = request.body || {};

        if (!email || !email.includes("@")) {
            return response.status(400).json({
                success: false,
                message: "Valid email is required"
            });
        }

        /*
         * The Admin Portal URL will be added here
         * through a Vercel environment variable.
         *
         * Never put an admin password or secret
         * directly inside this file.
         */

        const adminPortalURL =
            process.env.VANTARA_ADMIN_API_URL;

        if (!adminPortalURL) {
            return response.status(500).json({
                success: false,
                message: "Admin connection is not configured"
            });
        }

        const adminResponse = await fetch(
            adminPortalURL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name || "",
                    className: className || "",
                    email: email
                })
            }
        );

        const data =
            await adminResponse.json();

        if (!adminResponse.ok) {

            return response.status(502).json({
                success: false,
                message: "Unable to send registration"
            });

        }

        return response.status(200).json({
            success: true,
            message: "Registration submitted"
        });

    } catch (error) {

        return response.status(500).json({
            success: false,
            message: "Server error"
        });

    }
}