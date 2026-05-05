export const notImplemented = (feature) => (_req, res) => {
    res.status(501).json({
        ok: false,
        error: "not_implemented",
        feature,
    });
};
