import { useStudyViews } from "./studyViews";
import { useMediaViews } from "./mediaViews";
import { useSocialViews } from "./socialViews";
import type { EigoMasterViewDeps } from "./viewTypes";

export function useEigoMasterViews(deps: EigoMasterViewDeps) {
    const mediaViews = useMediaViews(deps);
    return {
        ...useStudyViews({ ...deps, ...mediaViews }),
        ...mediaViews,
        ...useSocialViews(deps)
    };
}
