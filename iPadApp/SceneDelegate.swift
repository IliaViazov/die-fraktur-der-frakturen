import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }
        let window = UIWindow(windowScene: windowScene)

        if windowScene.session.role == .windowExternalDisplay {
            // Projector: skip the intro, start immediately
            let vc = ViewController()
            vc.isExternalDisplay = true
            window.rootViewController = vc
        } else {
            // iPad screen: normal flow with intro
            window.rootViewController = ViewController()
        }

        self.window = window
        window.makeKeyAndVisible()
    }
}
