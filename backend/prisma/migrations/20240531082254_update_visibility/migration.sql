
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "published",
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC';
