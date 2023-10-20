# CourseChat API

## Overview

CourseChat API serves as the backend for the CourseChat application. It's constructed using [NestJS](https://nestjs.com/), a progressive Node.js framework designed for building efficient, scalable server-side applications. For readers unfamiliar with NestJS, you can delve deeper into its features and capabilities in the [official NestJS documentation](https://docs.nestjs.com/).

## Description

CourseChat offers an interactive platform tailored to aid students in mastering their course material. Leveraging the prowess of OpenAI's GPT-4 model and augmented by retrieval-generated content specific to courses, CourseChat aims to be a modular platform. With its extensibility, it holds the potential to seamlessly integrate with other educational platforms in the future, enhancing the overall learning experience.

## Running the Application Locally

To get CourseChat API up and running on your local machine:

1. **Prerequisites**: Ensure Git, Node, and PNPM (the new package manager for Node) are installed. Additionally, Docker needs to be set up and running to spin up a local Postgres server. If you're new to Docker, [here's a helpful guide](https://docs.docker.com/get-started/).
2. **Repository Setup**: Clone the repository and navigate to the root folder in the terminal.
3. **Dependencies**: Run `pnpm install`.
4. **Environment Configuration**: Add a `.env` file in the root folder, similar to `.env.example`, and fill in the required environment variables.
5. **Database Setup**: Run `pnpm docker:up` to initialize the Postgres server.

### Running the app

```bash
# development with watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start
```

**Tip**: During development, access the API at `http://localhost:3000` and view the Swagger UI documentation at `http://localhost:3000/api-docs`.

### Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Contributions

Contributing to CourseChat is simple and rewarding. Here's how you can be a part:

- **Identify a Change**: It can be a bug fix or an enhancement.
  - **Bug Fixes**: Raise a GitHub issue labeled `bug` detailing the issue.
  - **Enhancements**: Propose new features via a GitHub issue tagged `enhancement`.
  
- **Descriptive Titles**: Titles should be clear. For instance, "Fix Bug: API key not validating for `GET /assistants` endpoint" is preferable over a generic "Fix Bug."

- **Branch Creation**: 
  - For bug fixes, branch from the `main` branch.
  - For enhancements, use the `dev` branch as a base.
  - Stick to this naming convention for branches: `{author}-{type}-{name}`.

- **Code**: Commit frequently and push to the repository regularly.

- **Pull Request (PR)**: Once you're satisfied, raise a PR. Ensure your branch is up-to-date with the target branch (`main` or `dev`) to minimize conflicts.

- **Review**: Engage in the review process. Address feedback and iterate until your changes are approved.

- **Merging**: After approval, merge into the target branch. Merges from `dev` to `main` are handled by the team or tech lead.

- **Deployment**: It's automated, thanks to the [cyclic](https://www.cyclic.sh/)'s build pipeline.

Remember, every contribution, big or small, goes a long way in refining CourseChat!

## Contact

For further queries or clarifications related to CourseChat, feel free to reach out to Dr. Ali Madooei at `madooei@jhu.edu`.

## License

CourseChat is currently a private codebase. We have ambitions to transition this project into an open-source application in the future, allowing for broader collaboration and contribution. However, as of now, the distribution, reproduction, or reuse of the code or any part of the application outside of the authorized team is strictly prohibited. All contributors should exercise discretion and uphold this confidentiality to maintain the integrity and security of the project.
