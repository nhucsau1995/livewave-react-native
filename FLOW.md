# How the screenshots and demo GIF are made

The README media come from the real app running on an Android emulator, not from mockups.

## Regenerate

```bash
gh workflow run capture.yml -R nhucsau1995/livewave-react-native --ref main
gh run list -R nhucsau1995/livewave-react-native --workflow capture.yml -L 1
gh run watch <run-id> -R nhucsau1995/livewave-react-native --exit-status
gh run download <run-id> -R nhucsau1995/livewave-react-native -n capture -D capture-tmp/artifact
rm -rf screenshots && mv capture-tmp/artifact screenshots
```

## How it works

1. `.github/workflows/capture.yml` (manual dispatch) runs on `ubuntu-latest` with KVM: `npm ci`, `expo prebuild` + `gradlew assembleRelease` (production JS, no Metro), ffmpeg and Maestro.
2. `reactivecircus/android-emulator-runner` boots an API 34 Pixel 6 emulator and runs `.github/scripts/capture-emulator.sh expo` as one command.
3. The script installs the APK, does a warm-up launch, then runs `.maestro/screenshots.yaml`: real taps on `testID`s through welcome, first-run home, follow, home, explore, creator profile, watch live, gift sheet, go live setup, host room, stream health, summary, wallet, profile and stream settings, with one `takeScreenshot` per screen.
4. `.maestro/demo.yaml` replays the core loop as a returning user (watch a followed creator, send a gift, go live, open stream health, 8 taps) and records it with Maestro's `startRecording`/`stopRecording`. ffmpeg turns the mp4 into `demo.gif` (palette pass, 12 fps, 300 px wide).
5. The run fails unless there are 3+ PNGs and a GIF, then uploads them as the `capture` artifact. The workflow never commits; the files are committed separately.

## Local emulator

With an Android SDK and a booted emulator (`emulator -avd <name> -no-window -gpu swiftshader_indirect`):

```bash
npx expo prebuild --platform android --no-install
(cd android && ./gradlew assembleRelease)
APP_ID=com.livewave.app bash .github/scripts/capture-emulator.sh expo
```
