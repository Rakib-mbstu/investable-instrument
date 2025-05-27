export const validateInstrumentData = (data) => {
    const { price, estimatedReturn, maturityTime, availableUnits } = data;
    const errors = [];

    if (typeof price !== 'number' || price <= 0) {
        errors.push('Current Price must be a positive number.');
    }
    if (typeof estimatedReturn !== 'number') {
        errors.push('Estimated Return must be a number.');
    }
    if (typeof maturityTime !== 'number' || maturityTime <= 0) {
        errors.push('Maturity Time must be a positive number.');
    }
    if (typeof availableUnits !== 'number' || availableUnits < 0) {
        errors.push('Available Units must be a non-negative number.');
    }

    return errors.length ? errors : null;
};

export const validateBookingData = (data) => {
    const { instrumentId, units } = data;
    const errors = [];

    if (!instrumentId) {
        errors.push('Instrument ID is required.');
    }
    if (typeof units !== 'number' || units <= 0) {
        errors.push('Units must be a positive number.');
    }

    return errors.length ? errors : null;
};

export const validateReceiptUpload = (file) => {
    const errors = [];

    if (!file) {
        errors.push('Receipt file is required.');
    } else if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)) {
        errors.push('Receipt must be a JPEG, PNG, or PDF file.');
    }

    return errors.length ? errors : null;
};