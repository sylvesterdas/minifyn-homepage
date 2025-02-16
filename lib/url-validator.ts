import isURL from "validator/lib/isURL";

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export async function validateURL(url: string): Promise<ValidationResult> {
  // Basic URL validation
  if (
    !isURL(url, {
      require_protocol: true,
      require_valid_protocol: true,
      protocols: ["http", "https"],
      require_host: true,
      disallow_auth: true,
    })
  ) {
    return { isValid: false, error: "Invalid URL format" };
  }

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
    });

    // Check response status
    if (!response.ok) {
      return {
        isValid: false,
        error: `URL returned status ${response.status}`,
      };
    }

    // Check content type
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return { isValid: false, error: "API endpoints are not allowed" };
    }

    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: "URL is not accessible",
    };
  }
}
