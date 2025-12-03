class ZodValidationError extends Error {
  constructor(issues) {
    super('Validation failed');
    this.issues = issues;
  }
}

class ZString {
  constructor() {
    this._min = null;
  }

  min(value, message = `Expected at least ${value} characters`) {
    this._min = { value, message };
    return this;
  }

  parse(input, path = []) {
    const issues = [];
    if (typeof input !== 'string') {
      issues.push({ path, message: 'Expected string' });
    } else if (this._min && input.length < this._min.value) {
      issues.push({ path, message: this._min.message });
    }

    if (issues.length) {
      throw new ZodValidationError(issues);
    }
    return input;
  }

  optional() {
    return new ZOptional(this);
  }
}

class ZEnum {
  constructor(options) {
    this.options = options;
  }

  parse(input, path = []) {
    const issues = [];
    if (typeof input !== 'string' || !this.options.includes(input)) {
      issues.push({ path, message: `Expected one of: ${this.options.join(', ')}` });
    }

    if (issues.length) {
      throw new ZodValidationError(issues);
    }
    return input;
  }

  optional() {
    return new ZOptional(this);
  }
}

class ZOptional {
  constructor(inner) {
    this.inner = inner;
  }

  parse(input, path = []) {
    if (input === undefined) {
      return undefined;
    }
    return this.inner.parse(input, path);
  }

  optional() {
    return this;
  }
}

class ZObject {
  constructor(shape) {
    this.shape = shape;
  }

  parse(input) {
    const issues = [];
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
      issues.push({ path: [], message: 'Expected object' });
      throw new ZodValidationError(issues);
    }

    const data = {};
    for (const [key, schema] of Object.entries(this.shape)) {
      try {
        const value = schema.parse(input[key], [key]);
        if (value !== undefined) {
          data[key] = value;
        }
      } catch (error) {
        if (error instanceof ZodValidationError) {
          issues.push(...error.issues);
        } else {
          throw error;
        }
      }
    }

    if (issues.length) {
      throw new ZodValidationError(issues);
    }

    return data;
  }

  safeParse(input) {
    try {
      const data = this.parse(input);
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  }
}

export const z = {
  string: () => new ZString(),
  enum: (options) => new ZEnum(options),
  object: (shape) => new ZObject(shape),
};

export { ZodValidationError };
