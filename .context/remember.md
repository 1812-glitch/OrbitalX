# OrbitalX — Development Rules & Reminders

## Git Branching Workflow

After completing the implementation of any new feature, **you MUST push the code to the repository in a branch named after the completed feature**.

### Why
- Allows direct changes or updates to a specific feature branch in the future.
- Keeps the main branch clean and stable.
- Makes it easy to track, review, or rollback individual features.

### Branch Naming Convention
Use lowercase with hyphens. Name the branch after the feature that was completed.

**Examples:**
| Feature Completed | Branch Name |
|---|---|
| 3D Orbital Simulator | `feature/3d-orbital-simulator` |
| Telemetry Dashboard | `feature/telemetry-dashboard` |
| Authentication System | `feature/authentication` |
| Satellite Fleet Page | `feature/satellite-fleet` |
| Mission Control | `feature/mission-control` |
| Ground Stations | `feature/ground-stations` |
| Alerts & Incidents | `feature/alerts-incidents` |
| Admin Panel | `feature/admin-panel` |

### Workflow
1. Complete the feature implementation.
2. **VERIFY thoroughly** — test all functionality, check for errors, and look for missing things.
3. Fix any issues found during verification.
4. **ASK the user for permission** before pushing to the repository.
5. Only after approval: Create a new branch: `git checkout -b feature/<feature-name>`
6. Stage all changes: `git add .`
7. Commit with a descriptive message: `git commit -m "feat: <feature description>"`
8. Push the branch: `git push origin feature/<feature-name>`
9. Continue to the next feature on the working branch.

### Important
- **Do NOT skip verification.** Every completed feature must be tested for errors and missing things before pushing.
- **Do NOT push without permission.** Always ask the user before pushing to the repository.
- **Do NOT skip this step.** Every completed feature must have its own branch pushed to the repository.
